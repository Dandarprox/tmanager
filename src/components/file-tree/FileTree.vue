<script setup lang="ts">
import { FileTree, FileTreeCollapsableStatus, FileTreeFile, FileTreeFolder } from './file-tree';
import FileTreeItem from './FileTreeItem.vue';

const emits = defineEmits<{
  (event: 'toggle-folder', folder: string, status: FileTreeCollapsableStatus, section: string): void;
}>();
defineProps<{
  fileTree: FileTree;
}>();


function reportFolderToggle(
  folder: string,
  status: FileTreeCollapsableStatus,
  section: string
) {
  emits('toggle-folder', folder, status, section);
}
</script>

<template>
  <div class="bg-[#e5edf8] border-md backdrop-blur-md p-2 text-left whitespace-nowrap">
    <div 
      v-for="section in fileTree"
      :key="section.name"
      class="pl-3"
    >
      {{ section.name }}
    
      <FileTreeItem
        v-for="element in section.children" 
        :key="element.name"
        :level="1"
        :element="element"
        :path="[section.name]"
        @toggle-folder="(folder, status) => reportFolderToggle(folder, status, section.name)"
      >
        <template #folder="{ element: folderElement, path }">
          <slot
            name="folder"
            :element="(folderElement as FileTreeFolder)"
            :path="path"
          />
        </template>

        <template #file="{ element: fileElement, path }">
          <slot
            name="file"
            :element="(fileElement as FileTreeFile)"
            :path="path"
          />
        </template>
      </FileTreeItem>
    </div>
  </div>
</template>
