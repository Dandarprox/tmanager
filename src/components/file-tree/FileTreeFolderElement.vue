<script setup lang="ts">
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FileTreeElement } from './file-tree';

defineProps<{
  element: FileTreeElement;
}>();

</script>

<template>
  <div 
    class="py-1 pl-1 ft-hover-element"
  >
    <slot :element="element">
      <FontAwesomeIcon
        :icon="faFolder"
        color="#fddb7d"
        class="pl-1 drop-shadow-sm"
      />
      {{ element.name }}
    </slot>
  </div> 
</template>

<style scoped>
@import './styles/index.css';
</style>