<!-- eslint-disable @typescript-eslint/no-unused-expressions -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { FileTreeCollapsableStatus, FileTreeElement, fileTreeSample, FolderSeparatorChar } from './components/file-tree/file-tree';
import FileTree from './components/file-tree/FileTree.vue';

const data = ref(fileTreeSample);
const toggleFolders = ref(false);
const hideUnmarkedFolders = ref(false);

watch(() => hideUnmarkedFolders.value, (value) => {
  if (!value) {
    return;
  }

  Object.entries(markedFolders.value).forEach(([, { marked, toggleSubtree }]) => {
    if (!marked) {
      console.log('toggling off subtree')
      toggleSubtree();
    }
  });
});

function toggleFolder(folder: string, status: FileTreeCollapsableStatus, section: string) {
  if (!toggleFolders.value) {
    return;
  }

  const path = folder.split(FolderSeparatorChar);
  const currentSection = data.value.find((element) => element.name === section);
  
  currentSection?.children.forEach((children) => {
    applyFolderStatus(children, path, status);
  });
}

function applyFolderStatus(tree: FileTreeElement, path: string[], status: FileTreeCollapsableStatus,  currentIndex = 0) {
  if (tree.type !== 'folder') {
    return;
  }
  
  if (currentIndex === path.length - 1 && tree.name === path[currentIndex]) {
    tree.status = status;
    
    return;
  }
  
  if (tree.name === path[currentIndex]) {
    tree.children.forEach((children) => {
      applyFolderStatus(children, path, status, currentIndex + 1);
    });
  }
}

const markedFiles = ref<Record<string, boolean>>({});
const markedFolders = ref<Record<string, { marked: boolean; toggleSubtree: () => void; }>>({});

function markFileTreeElement(element: FileTreeElement, path: string, toggleSubtree?: () => void) {
  if (element.type === 'folder') {
    console.log({toggleSubtree})
    markedFolders.value[path] ??= {
      marked: false,
      toggleSubtree: toggleSubtree!,
    };
    markedFolders.value[path].marked = !markedFolders.value[path].marked;
    
    return;
  } 

  markedFiles.value[path] ??= false;
  markedFiles.value[path] = !markedFiles.value[path];
}
</script>

<template>
  <div class="container">
    <button 
      :class="toggleFolders ? 'bg-green-500' : 'bg-red-500'"
      @click="toggleFolders = !toggleFolders"
    >
      Toggable folders
    </button>
      
    <button
      :class="hideUnmarkedFolders ? 'bg-green-500' : 'bg-red-500'"
      @click="hideUnmarkedFolders = !hideUnmarkedFolders"
    >
      Hide unmarked folders
    </button>

    <div class="flex justify-center">
      <FileTree 
        class="w-full"
        :file-tree="data"
        @toggle-folder="toggleFolder"
      >
        <template #folder="{element, path, toggleSubTree}">
          <div
            v-show="hideUnmarkedFolders ? markedFolders[path] : true"
            :class="{ 'bg-amber-400': markedFolders[path] }"
            @click="markFileTreeElement(element, path, toggleSubTree)"
          >
            > <span>{{ element.name }}</span> ({{ path }})
          </div>
        </template>

        <template #file="{element, path}">
          <div 
            :class="{ 'bg-green-500': markedFiles[path] }"
            @click="markFileTreeElement(element, path)"
          >
            + <span>{{ element.name }}</span> ({{ path }}) 
          </div>
        </template>
      </FileTree>
    </div>
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

</style>
