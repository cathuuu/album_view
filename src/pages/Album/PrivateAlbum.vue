<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

import FolderGrid from '../../components/FolderGrid.vue';
import { createNewAlbum, fetchAllItems } from '../../services/Item';
import type { StorageItem, ItemType } from '../../types/StorageItem';

// =========================
// ⚙️ Setup
// =========================
const router = useRouter();
const toast = useToast();

// =========================
// 📦 State
// =========================
const allItems = ref<StorageItem[]>([]);
const filteredItems = ref<StorageItem[]>([]);
const isLoading = ref(true);

const createFolderVisible = ref(false);
const newFolderName = ref('');
const searchQuery = ref('');
const sortOption = ref<'name' | 'date' | 'size'>('name');
const currentFolderId = ref<string | null>(null); // hỗ trợ xem folder con trong tương lai

// =========================
// 🧮 Computed
// =========================
const privateItems = computed(() =>
  allItems.value.filter(item => !item.isDeleted && !item.isShared)
);

// =========================
// 🚀 Lifecycle
// =========================
onMounted(async () => {
  await loadData();
});

// =========================
// 🔄 Methods
// =========================
const loadData = async () => {
  isLoading.value = true;
  try {
    const data = await fetchAllItems();
    allItems.value = data;
    filteredItems.value = [...privateItems.value];
  } catch (err) {
    console.error('❌ Lỗi tải dữ liệu:', err);
    allItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  filteredItems.value = privateItems.value.filter(item =>
    item.name?.toLowerCase().includes(query)
  );
};

const handleSortChange = () => {
  filteredItems.value.sort((a, b) => {
    if (sortOption.value === 'name') return a.name.localeCompare(b.name);
    if (sortOption.value === 'date') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    if (sortOption.value === 'size') return (b.size ?? 0) - (a.size ?? 0);
    return 0;
  });
};

const handleCreateFolder = async () => {
  const name = newFolderName.value.trim();
  if (!name) {
    toast.add({
      severity: 'warn',
      summary: 'Tên thư mục trống',
      detail: 'Vui lòng nhập tên thư mục trước khi tạo.',
      life: 3000,
    });
    return;
  }

  try {
    toast.add({
      severity: 'info',
      summary: 'Đang xử lý',
      detail: `Tạo thư mục "${name}"...`,
      life: 2000,
    });

const newAlbum = await createNewAlbum(name, false  );

    const newFolder: StorageItem = {
      id: newAlbum.id,
      name: newAlbum.name,
      type: 'folder' as ItemType,
      isDeleted: false,
      isShared: newAlbum.isShared ?? false,
      createdAt: newAlbum.createdAt,
      updatedAt: newAlbum.updatedAt ?? newAlbum.createdAt,
      path: newAlbum.path ?? '',
    };

    allItems.value.unshift(newFolder);
    filteredItems.value.unshift(newFolder);

    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: `Đã tạo thư mục "${newAlbum.name}"`,
      life: 3000,
    });

    createFolderVisible.value = false;
    newFolderName.value = '';
  } catch (err) {
    console.error('❌ Lỗi tạo thư mục:', err);
    toast.add({
      severity: 'error',
      summary: 'Thất bại',
      detail: 'Không thể tạo thư mục. Vui lòng thử lại.',
      life: 3000,
    });
  }
};

const handleItemClick = (item: StorageItem) => {
  if (item.type === 'folder') {
    router.push({ name: 'AlbumDetail', params: { id: item.id } });
  } else {
    toast.add({
      severity: 'info',
      summary: 'Xem tệp',
      detail: `Mở tệp: ${item.name}`,
      life: 2000,
    });
  }
};
</script>

<template>
  <Toast />

  <div class="">
  <!-- Toolbar -->
  <div
    class="flex flex-col md:flex-row items-center justify-between gap-3 p-5 bg-[#1c1d20] text-gray-100 border-b border-[#2a2b2f]"
  >
    <div class="flex items-center gap-3">
      <h2 class="text-xl md:text-2xl font-semibold">📁 Album Riêng Tư</h2>
      <Button
        label="Mới"
        icon="pi pi-plus"
        class="bg-blue-600 border-none hover:bg-blue-500"
        @click="createFolderVisible = true"
      />
    </div>

    <div class="flex flex-wrap gap-3 items-center">
      <!-- Search -->
      <span class="p-input-icon-left">
        <i class="pi pi-search text-gray-400"></i>
        <InputText
          v-model="searchQuery"
          placeholder="Tìm kiếm..."
          class="bg-[#2a2b2f] border-none text-gray-200"
          @input="handleSearch"
        />
      </span>

      <!-- Sort -->
      <select
        v-model="sortOption"
        @change="handleSortChange"
        class="bg-[#2a2b2f] text-gray-200 rounded-md px-3 py-2 outline-none border border-[#3a3b3f] hover:border-gray-400"
      >
        <option value="name">Tên (A → Z)</option>
        <option value="date">Ngày tạo</option>
        <option value="size">Kích thước</option>
      </select>
    </div>
  </div>

<div class="folder-grid">
<FolderGrid
    :items="filteredItems"
    :isLoading="isLoading"
    @item-click="handleItemClick"
    class="animate-fade-in"
  />
  </div>
  </div>
  <!-- Create Folder Dialog -->
  <Dialog
    v-model:visible="createFolderVisible"
    header="Tạo Thư Mục Mới"
    :modal="true"
    class="w-full md:w-3/12"
  >
    <div class="p-3">
      <label for="folderName" class="font-semibold mb-2 block">Tên Thư Mục</label>
      <InputText
        id="folderName"
        v-model="newFolderName"
        placeholder="Nhập tên thư mục"
        @keyup.enter="handleCreateFolder"
        class="w-full"
      />
    </div>

    <template #footer>
      <Button label="Hủy" icon="pi pi-times" text @click="createFolderVisible = false" />
      <Button
        label="Tạo"
        icon="pi pi-check"
        class="bg-blue-600 border-none hover:bg-blue-500"
        :disabled="!newFolderName.trim()"
        @click="handleCreateFolder"
      />
    </template>
  </Dialog>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
.folder-grid {
  padding: 30px;
  background-color: #ebebeb;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
</style>
