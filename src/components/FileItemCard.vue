<script setup lang="ts">
import { ref } from 'vue';
import type { StorageItem } from '../types/StorageItem';
import  Menu  from 'primevue/menu';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

const props = defineProps<{ item: StorageItem }>();
const emit = defineEmits(['menu-click']);
const menu = ref();

const menuItems = [
  { label: 'Xem chi tiết', icon: 'pi pi-info-circle', command: () => emit('menu-click', props.item) },
  { label: 'Đổi tên', icon: 'pi pi-pencil' },
  { label: 'Tải xuống', icon: 'pi pi-download' },
  { label: 'Xóa', icon: 'pi pi-trash', class: 'text-red-400' },
];
</script>

<template>
  <div
    class="group relative bg-[#2a2b2f] hover:bg-[#343539] rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-lg hover:scale-[1.03] border border-transparent hover:border-[#3a3b3f]"
  >
    <!-- Icon/Thumbnail -->
    <div class="flex justify-center items-center h-28 mb-3">
      <!-- Folder -->
      <i
        v-if="item.isAlbum"
        class="pi pi-folder text-yellow-400 text-6xl"
      ></i>

      <!-- Image -->
      <img
        v-else-if="item.thumbnailUrl"
        :src="item.thumbnailUrl"
        class="w-full h-28 object-cover rounded-lg border border-[#3a3b3f]"
      />

      <!-- File -->
      <i v-else class="pi pi-file text-blue-400 text-5xl"></i>
    </div>

    <!-- File name -->
    <div
      class="truncate text-sm text-center text-gray-200 group-hover:text-white font-medium"
      v-tooltip.top="item.name"
    >
      {{ item.name }}
    </div>

    <!-- Favorite badge -->
    <div
      v-if="item.isFavorite"
      class="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-md"
    >
      ★
    </div>

    <!-- Menu -->
    <Button
      icon="pi pi-ellipsis-v"
      text
      rounded
      severity="secondary"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3a3b3f]"
      @click.stop="menu.toggle($event)"
    />
    <Menu ref="menu" :model="menuItems" popup />
  </div>
</template>

<style scoped>
:deep(.p-menu) {
  background-color: #2a2b2f;
  border: 1px solid #3a3b3f;
  color: #f0f0f0;
}
:deep(.p-menuitem:hover) {
  background-color: #3c3d41 !important;
}
:deep(.p-button) {
  border: none;
}
</style>
