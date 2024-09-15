<script setup lang="ts">
import { faFolder, faFile, faFileWord, faFileText, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { fork } from 'radash';
import { ref, watchEffect } from 'vue';
import { FileTreeCollapsableStatus, FileTreeFile, FileTreeFolder, FolderSeparatorChar, type FileTreeElement } from './file-tree';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits<{
  (event: 'toggleFolder', folderPath: string, status: FileTreeCollapsableStatus): void;
}>();
const props = defineProps<{
  level: number;
  element: FileTreeElement;
}>();

const folders = ref<FileTreeFolder[]>([]);
const files = ref<FileTreeFile[]>([]);

const extensionMapping = {
  'doc': faFileWord,
  'docx': faFileWord,
  'pdf': faFileWord,
  'txt': faFileText,
  'xlsx': faFileExcel,
  '_file': faFile,
}

function getIconForFile<
  Key extends keyof typeof extensionMapping = keyof typeof extensionMapping
>(file: FileTreeFile): (typeof extensionMapping)[Key] {
  const extension  = file.name.split('.').pop() as Key;
  const icon = extensionMapping[extension];

  return icon || faFile;
}

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
    <span 
      @click="emit(
        'toggleFolder',
        element.name,
        element.type === 'folder' && element.status === 'open' ? 'closed' : 'open'
      )"
      class="inline-block py-1 pl-1">
      <FontAwesomeIcon :icon="faFolder" color="#fddb7d"/>
      {{ element.name }}
    </span>
    
      <!-- Folders -->
      <FileTreeItem
        v-for="folder in folders" :key="folder.name"
        v-show="folder.status === 'open'"
        @toggle-folder="(childFolder, status) => reportCurrentFolder(element.name, childFolder, status)"
        :level="level + 1"
        :element="folder"
      ></FileTreeItem>
      
      <!-- Files -->
      <div 
        v-for="file in files" :key="file.name" 
        class="pl-[10px] text-ellipsis overflow-hidden py-1"
      >
        <FontAwesomeIcon :icon="getIconForFile(file)"/>
        {{ file.name }}
      </div>
  </div>
</template>
