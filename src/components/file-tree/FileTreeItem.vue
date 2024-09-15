<script setup lang="ts">
import { fork } from 'radash';
import { computed, ref, watchEffect } from 'vue';
import { FileTreeCollapsableStatus, FileTreeElement, FileTreeFile, FileTreeFolder, FolderSeparatorChar } from './file-tree';
import FileTreeFolderElement from './FileTreeFolderElement.vue';
import FileTreeFileElement from './FileTreeFileElement.vue';

const emit = defineEmits<{
  (event: 'toggleFolder', folderPath: string, status: FileTreeCollapsableStatus): void;
}>();
const props = defineProps<{
  level: number;
  element: FileTreeElement;
}>();

const folders = ref<FileTreeFolder[]>([]);
const files = ref<FileTreeFile[]>([]);

const isParentElementOpen = computed(
  () => props.element.type === 'folder' && props.element.status === 'open'
);


function reportCurrentFolder(
  parentFolder: string,
  childFolder: string,
  status: FileTreeCollapsableStatus
) {
  emit('toggleFolder', `${parentFolder}${FolderSeparatorChar}${childFolder}`, status);
}

watchEffect(() => {
  if (props.element.type === 'file') {
    files.value.push(props.element);

    return;
  }

  const [forkedFolders, forkedFiles] = fork(
    props.element.children,
    (files) => files.type === 'folder'
  );

  folders.value = forkedFolders as FileTreeFolder[];
  files.value = forkedFiles as FileTreeFile[];
});
</script>

<template>
  <div :style="{ paddingLeft: `${level * 10}px` }">
    <FileTreeFolderElement 
      :element="element"
      @click="emit(
        'toggleFolder',
        element.name,
        element.type === 'folder' && element.status === 'open' ? 'closed' : 'open'
      )"
    >
      <template #default="{ element: folderElement }">
        <slot 
          name="folder"
          :element="(folderElement as FileTreeFolder)" 
        />
      </template>
    </FileTreeFolderElement>
    
    <TransitionGroup name="list">
      <!-- Folders -->
      <FileTreeItem
        v-for="(folder, index) in folders"
        v-show="isParentElementOpen"
        :key="folder.name"
        :data-index="index"
        :level="level + 1"
        :element="folder"
        @toggle-folder="(childFolder, status) => reportCurrentFolder(element.name, childFolder, status)"
      >
        <template #folder="{ element: folderElement }">
          <slot
            name="folder"
            :element="folderElement"
          />
        </template>
        
        <template #file="{ element: fileElement }">
          <slot
            name="file"
            :element="fileElement"
          />
        </template>
      </FileTreeItem>
      
      <!-- Files -->
      <div
        v-for="(file, index) in files"
        v-show="isParentElementOpen" 
        :key="file.name"
      >
        <FileTreeFileElement 
          :element="file"
        >
          <slot
            name="file"
            :element="file"
            :index="index"
          />
        </FileTreeFileElement>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@import './styles/index.css';
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
