<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import  Skeleton  from 'primevue/skeleton';
import Button from 'primevue/button';
import type { StorageItem } from '../types/StorageItem';

const props = defineProps<{
  items: StorageItem[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'item-click', item: StorageItem): void;
}>();

const getFileThumbnail = (item: StorageItem) => {
  if (item.thumbnailUrl) return item.thumbnailUrl;
  if (item.isAlbum) return '/icons/folder-blue.svg';
  if (item.type?.includes('image')) return '/icons/image.svg';
  if (item.type?.includes('pdf')) return '/icons/pdf.svg';
  return '/icons/file.svg';
};
</script>

<template>
  <div class="folder-grid-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-auto-fit gap-4 p-4">
      <Skeleton v-for="n in 12" :key="n" height="160px" borderRadius="12px" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!items?.length" class="empty-state">
      <i class="pi pi-folder-open text-4xl mb-2 text-gray-400"></i>
      <p>Không có mục nào trong thư mục này</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-auto-fit gap-4 p-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="file-card group"
        @click="emit('item-click', item)"
      >
        <div class="thumb-wrapper">
          <img
            :src="getFileThumbnail(item)"
            alt=""
            class="file-thumb"
          />
          <div class="menu-btn opacity-0 group-hover:opacity-100">
            <Button icon="pi pi-ellipsis-v" text rounded />
          </div>
        </div>

        <div class="file-info">
          <span class="file-name" :title="item.name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Grid Layout */
.grid-cols-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

/* Container */
.folder-grid-container {
  background-color: #fdfeff;
  min-height: 80vh;
}

/* File Card */
.file-card {
  background: #868a97;
  margin: 10px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  border: 1px solid #f8f8f8;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.25);
}
.file-card:hover {
  transform: translateY(-3px);
  border-color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Thumbnail */
.thumb-wrapper {
  position: relative;
  width: 100%;
  height: 130px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.file-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}
.file-card:hover .file-thumb {
  transform: scale(1.03);
}

/* Menu Button */
.menu-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  transition: opacity 0.2s ease;
}

/* File Info */
.file-info {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-name {
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem;
  color: #9ca3af;
}
</style>
