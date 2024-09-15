<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FileTreeFile } from './file-tree';
import { getIconForFile } from './file-tree-file-manager';

defineProps<{
  element: FileTreeFile;
}>();
</script>

<template>
  <div 
    class="pl-[10px] text-ellipsis overflow-hidden py-1 ft-hover-element"
  >
    <slot :element="element">
      <FontAwesomeIcon
        :icon="getIconForFile(element)"
        class="pl-1 drop-shadow-sm"
      />
      {{ element.name }}
    </slot>
  </div> 
</template>

<style scoped>
@import './styles/index.css';
</style>