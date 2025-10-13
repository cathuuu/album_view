<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FolderGrid from '../../components/FolderGrid.vue';
import type { StorageItem } from '../../types/StorageItem';
import { useRouter } from 'vue-router';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

// 🔧 Service
import { fetchAllItems, createNewAlbum } from '../../services/Item';

// 🔔 State
const toast = useToast();
const router = useRouter();

const isLoading = ref<boolean>(true);
const allItems = ref<StorageItem[]>([]);
const createFolderVisible = ref<boolean>(false);
const newFolderName = ref<string>('');

// 🧩 Lọc ra album công khai
const publicItems = computed(() =>
  allItems.value.filter((it) => it.isPublic && !it.isDeleted)
);

// 🚀 Tải dữ liệu
const loadData = async () => {
  isLoading.value = true;
  try {
    allItems.value = await fetchAllItems();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu.', life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

// 🗂️ Tạo thư mục mới
const handleCreateFolder = async () => {
  const name = newFolderName.value.trim();
  if (!name) {
    toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên thư mục không được để trống.', life: 3000 });
    return;
  }

  try {
    toast.add({ severity: 'info', summary: 'Đang xử lý', detail: `Đang tạo thư mục "${name}"...`, life: 2000 });
    const newAlbum = await createNewAlbum(name, true);
    allItems.value.unshift(newAlbum);

    toast.add({ severity: 'success', summary: 'Thành công', detail: `Đã tạo thư mục "${newAlbum.name}"!`, life: 3000 });
    createFolderVisible.value = false;
    newFolderName.value = '';
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Không thể tạo thư mục.', life: 3000 });
  }
};

// 📁 Khi nhấn vào item
const handleItemClick = (item: StorageItem) => {
  if (item.isAlbum) {
    router.push({ name: 'AlbumDetail', params: { id: item.id } });
  }
};

onMounted(loadData);
</script>

<template>
  <div class="album-public-page">
    <Toast />

    <!-- Header -->
    <div class="flex justify-between items-center px-6 pt-4 pb-2">
      <h2 class="text-xl font-semibold text-gray-200">Album Công Khai</h2>
      <Button
        label="Tạo Thư Mục"
        icon="pi pi-folder-plus"
        class="p-button-rounded p-button-primary"
        @click="createFolderVisible = true"
      />
    </div>

    <!-- Folder Grid -->
    <FolderGrid
      :items="publicItems"
      :isLoading="isLoading"
      @item-click="handleItemClick"
    />

    <!-- Dialog tạo thư mục -->
    <Dialog
      v-model:visible="createFolderVisible"
      header="Tạo Thư Mục Mới"
      :modal="true"
      class="w-full md:w-3/12"
    >
      <div class="p-fluid">
        <div class="field">
          <label for="folderName" class="font-semibold mb-2 block">Tên Thư Mục</label>
          <InputText
            id="folderName"
            v-model="newFolderName"
            placeholder="Nhập tên thư mục"
            @keyup.enter="handleCreateFolder"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Hủy" icon="pi pi-times" text @click="createFolderVisible = false" />
        <Button label="Tạo" icon="pi pi-check" :disabled="!newFolderName.trim()" @click="handleCreateFolder" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.album-public-page {
  background-color: #ffffff;
  min-height: 100vh;
  color: #4d69a1;
}
</style>
