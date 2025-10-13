<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import FolderGrid from '../../components/FolderGrid.vue';
import { createNewAlbum, fetchAllItems } from '../../services/Item';
import type { StorageItem } from '../../types/StorageItem';

// ========================
// State & Composables
// ========================
const toast = useToast();
const router = useRouter();

const isLoading = ref(true);
const allItems = ref<StorageItem[]>([]);
const createFolderVisible = ref(false);
const newFolderName = ref('');

// ========================
// Computed
// ========================
const privateItems = computed(() =>
  allItems.value.filter(item => !item.isPublic && !item.isDeleted)
);

const filteredItems = ref<StorageItem[]>([]);
const searchQuery = ref('');
const sortOption = ref<'name' | 'date' | 'size'>('name');

// ========================
// Lifecycle
// ========================
onMounted(async () => {
  await loadData();
});

// ========================
// Methods
// ========================
const loadData = async () => {
  isLoading.value = true;
  try {
    allItems.value = await fetchAllItems();
    filteredItems.value = [...privateItems.value];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    allItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  const q = searchQuery.value.trim().toLowerCase();
  filteredItems.value = privateItems.value.filter(item =>
    item.name.toLowerCase().includes(q)
  );
};

const handleSortChange = () => {
  filteredItems.value.sort((a, b) => {
    if (sortOption.value === 'name') return a.name.localeCompare(b.name);
    if (sortOption.value === 'date')
      return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
    if (sortOption.value === 'size') return b.size - a.size;
    return 0;
  });
};

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Cảnh báo',
      detail: 'Tên thư mục không được để trống.',
      life: 3000
    });
    return;
  }

  try {
    const albumName = newFolderName.value.trim();
    toast.add({
      severity: 'info',
      summary: 'Đang xử lý',
      detail: `Đang tạo thư mục "${albumName}"...`,
      life: 2000
    });

    const newAlbum = await createNewAlbum(albumName, false);
    allItems.value.unshift(newAlbum);
    filteredItems.value.unshift(newAlbum);

    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: `Đã tạo thư mục "${newAlbum.name}"!`,
      life: 3000
    });

    createFolderVisible.value = false;
    newFolderName.value = '';
  } catch (error) {
    console.error('Lỗi tạo thư mục:', error);
    toast.add({
      severity: 'error',
      summary: 'Thất bại',
      detail: 'Không thể tạo thư mục.',
      life: 3000
    });
  }
};

const handleItemClick = (item: StorageItem) => {
  if (item.isAlbum) {
    router.push({ name: 'AlbumDetail', params: { id: item.id } });
  } else {
    toast.add({
      severity: 'info',
      summary: 'Xem tệp',
      detail: `Mở xem: ${item.name}`,
      life: 2000
    });
  }
};
</script>

<template>
  <Toast />

  <!-- Header Toolbar -->
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
      <span class="p-input-icon-left">
        <i class="pi pi-search text-gray-400"></i>
        <InputText
          v-model="searchQuery"
          placeholder="Tìm kiếm..."
          class="bg-[#2a2b2f] border-none text-gray-200"
          @input="handleSearch"
        />
      </span>

      <select
        v-model="sortOption"
        @change="handleSortChange"
        class="bg-[#2a2b2f] text-gray-200 rounded-md px-3 py-2 outline-none border border-[#3a3b3f] hover:border-gray-400"
      >
        <option value="name">Tên (A → Z)</option>
        <option value="date">Ngày tải lên</option>
        <option value="size">Kích thước</option>
      </select>
    </div>
  </div>

  <!-- Grid View -->
  <FolderGrid
    :items="filteredItems"
    :isLoading="isLoading"
    @item-click="handleItemClick"
  />

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
/* ===========================
   Layout & Toolbar
=========================== */
div.bg-\[\#1c1d20\] {
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

/* ===========================
   Search Input
=========================== */
.p-inputtext {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.p-inputtext:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.4);
  background-color: #2f3033;
}

/* ===========================
   Select dropdown
=========================== */
select {
  transition: all 0.2s ease;
}
select:hover {
  background-color: #35363b;
}

/* ===========================
   Buttons
=========================== */
.p-button {
  border-radius: 8px !important;
  font-weight: 500;
  transition: background-color 0.25s ease, transform 0.2s ease;
}
.p-button:hover {
  transform: translateY(-1px);
}

/* ===========================
   FolderGrid cards (imported)
=========================== */
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.2rem;
  padding: 1.5rem;
  background-color: #121315;
  min-height: 80vh;
}

.folder-card {
  background: linear-gradient(145deg, #1d1e22, #232427);
  border: 1px solid #2e2f34;
  border-radius: 14px;
  padding: 1rem;
  transition: all 0.25s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e5e7eb;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}
.folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.45);
  border-color: #4f46e5;
}

/* ===========================
   Folder icon & name
=========================== */
.folder-icon {
  font-size: 2.5rem;
  color: #60a5fa;
  margin-bottom: 0.6rem;
}

.folder-name {
  font-size: 0.95rem;
  text-align: center;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===========================
   Empty state
=========================== */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1rem;
}

/* ===========================
   Dialog
=========================== */
.p-dialog .p-dialog-header {
  background-color: #1c1d20;
  color: #e5e7eb;
}
.p-dialog .p-dialog-content {
  background-color: #1c1d20;
}
.p-dialog .p-dialog-footer {
  background-color: #1c1d20;
}
</style>
