<script setup lang="ts">
import { FileTree, FileTreeCollapsableStatus } from './file-tree';
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
        @toggle-folder="(folder, status) => reportFolderToggle(folder, status, section.name)"
      />
    </div>
  </div>
</template>
