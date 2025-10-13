<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FolderView from '../../components/FolderView.vue';
import type { StorageItem } from '../../types/StorageItem';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { fetchAllItems, createNewAlbum } from '../../services/Item';

const toast = useToast();
const isLoading = ref<boolean>(true);
const allItems = ref<StorageItem[]>([]);
const router = useRouter();

const createFolderVisible = ref<boolean>(false);
const newFolderName = ref<string>('');

const publicItems = computed<StorageItem[]>(() =>
  allItems.value.filter((it) => it.isPublic && !it.isDeleted)
);

const loadData = async () => {
  isLoading.value = true;
  try {
    allItems.value = await fetchAllItems();
  } finally {
    isLoading.value = false;
  }
};

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên thư mục không được để trống.', life: 3000 });
    return;
  }
  const name = newFolderName.value.trim();
  try {
    toast.add({ severity: 'info', summary: 'Đang xử lý', detail: `Đang tạo thư mục "${name}"...`, life: 3000 });
    const newAlbum = await createNewAlbum(name, true);
    allItems.value.unshift(newAlbum);
    toast.add({ severity: 'success', summary: 'Thành công', detail: `Đã tạo thư mục "${newAlbum.name}"!`, life: 3000 });
    createFolderVisible.value = false;
    newFolderName.value = '';
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Không thể tạo thư mục.', life: 3000 });
  }
};

const handleItemClick = (item: StorageItem) => {
  if (item.isAlbum) {
    router.push({ name: 'AlbumDetail', params: { id: item.id } });
  }
};

onMounted(loadData);
</script>

<template>
  <Toast />
  <FolderView
    title="Album Công Khai"
    :items="publicItems"
    :isLoading="isLoading"
    :rows="16"
    :showBreadcrumb="false"
    emptyMessage="Không có mục công khai. Hãy tạo một thư mục mới!"
    showCreateButton
    createButtonLabel="Tạo Thư Mục"
    @create-folder-click="createFolderVisible = true"
    @item-click="handleItemClick"
  />

  <Dialog v-model:visible="createFolderVisible" header="Tạo Thư Mục Mới" :modal="true" class="w-full md:w-3/12">
    <div class="p-fluid">
      <div class="field">
        <label for="folderName" class="font-semibold mb-2 block">Tên Thư Mục</label>
        <InputText id="folderName" v-model="newFolderName" placeholder="Nhập tên thư mục" @keyup.enter="handleCreateFolder" />
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" text @click="createFolderVisible = false" />
      <Button label="Tạo" icon="pi pi-check" :disabled="!newFolderName.trim()" @click="handleCreateFolder" />
    </template>
  </Dialog>
</template>