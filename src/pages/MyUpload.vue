<template>
  <Toast />

  <div class="p-6">
    <!-- HEADER -->
    <header class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="pi pi-folder text-blue-500"></i>
          Thư viện của bạn
        </h2>

        <span
          v-if="breadcrumb.length"
          class="text-gray-500 text-sm truncate max-w-[300px]"
        >
          / {{ breadcrumb.join(' / ') }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <FileUpload
          name="file"
          mode="basic"
          chooseLabel="Tải lên"
          :customUpload="true"
          @select="handleUpload"
          class="p-button-sm p-button-rounded p-button-success"
        />
        <Button
          icon="pi pi-folder-plus"
          label="Tạo thư mục"
          class="p-button-sm p-button-rounded p-button-info"
          @click="showCreateFolderDialog = true"
        />
      </div>
    </header>

    <!-- TOOLBAR FILTER -->
    <div class="flex justify-between items-center mb-4 text-sm text-gray-500">
      <div class="flex gap-3 items-center">
        <Button icon="pi pi-sort-amount-down" label="Sắp xếp" text />
        <Button icon="pi pi-filter" label="Lọc" text />
      </div>

      <div class="flex gap-2 items-center">
        <label class="text-gray-600">Cột:</label>
        <select
          v-model="gridColumns"
          class="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none"
        >
          <option v-for="n in 7" :key="n" :value="n">{{ n }}</option>
        </select>

        <Button
          :icon="isListView ? 'pi pi-th-large' : 'pi pi-bars'"
          text
          @click="toggleView"
        />
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="!items.length"
      class="flex flex-col items-center justify-center text-gray-500 py-20"
    >
      <i class="pi pi-folder-open text-6xl mb-3"></i>
      <p class="text-lg">
        Chưa có mục nào. Hãy tải lên vài hình ảnh hoặc video 🎬
      </p>
    </div>

    <!-- GRID / LIST VIEW -->
    <div
    class="ss"
      v-else
      :class="[
        'gap-4',
        isListView
          ? 'flex flex-col'
          : `grid sm:grid-cols-2 md:grid-cols-${gridColumns} lg:grid-cols-${gridColumns}`
      ]"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="relative bg-white rounded-xl border border-gray-200 hover:shadow-md overflow-hidden transition-all group"
        @dblclick="handleOpenFolder(item)"
      >
        <!-- PREVIEW -->
        <div
          class="priview aspect-square w-full overflow-hidden bg-gray-50 relative flex items-center justify-center"
          :class="{ 'aspect-auto h-32 flex-shrink-0': isListView }"
        >
          <template v-if="item.type === 'media'">
            <img
              :src="item.coverUrl"
              alt="media"
              class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </template>

          <template v-else>
            <div
              class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
            >
              <i class="pi pi-folder text-4xl mb-2 text-amber-500"></i>
              <span class="text-xs font-medium">Thư mục</span>
            </div>
          </template>

          <!-- HOVER OVERLAY -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
          >
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-text text-white"
              @click.stop="handlePreview(item)"
            />
            <Button
              icon="pi pi-share-alt"
              class="p-button-rounded p-button-text text-white"
              @click.stop="handleShare(item)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-text text-white"
              @click.stop="handleDelete(item)"
            />
          </div>
        </div>

        <!-- INFO -->
        <div class="p-3 flex flex-col gap-1">
          <p class="font-semibold text-gray-800 truncate" :title="item.name">
            {{ item.name }}
          </p>
          <p class="text-xs text-gray-500">{{ formatDate(item.createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- PREVIEW DIALOG -->
    <Dialog
      v-model:visible="previewVisible"
      :header="selectedItem?.name"
      modal
      dismissableMask
      class="max-w-3xl w-full"
    >
      <div class="flex justify-center items-center">
        <img
          v-if="selectedItem?.type === 'media'"
          :src="selectedItem.coverUrl"
          alt="Preview"
          class="rounded-lg max-h-[80vh] object-contain"
        />
        <p v-else class="text-gray-600">Thư mục này chưa có nội dung hiển thị</p>
      </div>
    </Dialog>

    <!-- CREATE FOLDER DIALOG -->
    <Dialog
      v-model:visible="showCreateFolderDialog"
      header="Tạo thư mục mới"
      modal
      class="max-w-sm"
    >
      <div class="flex flex-col gap-3">
        <input
          v-model="newFolderName"
          placeholder="Tên thư mục"
          class="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div class="flex justify-end gap-2">
          <Button label="Hủy" text @click="showCreateFolderDialog = false" />
          <Button label="Tạo" icon="pi pi-check" @click="handleCreateFolder" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import {
  fetchAllItems,
  uploadNewItem,
  createNewAlbum
} from '../services/Item';
import type { StorageItem } from '../types/StorageItem';

// ===== STATE =====
const toast = useToast();
const items = ref<StorageItem[]>([]);
const breadcrumb = ref<string[]>([]);
const isListView = ref(false);
const gridColumns = ref(5);

// DIALOGS
const previewVisible = ref(false);
const selectedItem = ref<StorageItem | null>(null);
const showCreateFolderDialog = ref(false);
const newFolderName = ref('');

// ===== LOAD DATA =====
const loadItems = async () => {
  try {
    const data = await fetchAllItems(null);
    items.value = data.sort(
      (a, b) =>
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
    );
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi tải dữ liệu',
      detail: String(err),
      life: 4000
    });
  }
};

// ===== UPLOAD =====
const handleUpload = async (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  if (!file) return;
  try {
    const newItem = await uploadNewItem(file);
    items.value.unshift(newItem);
    toast.add({
      severity: 'success',
      summary: 'Tải lên thành công',
      detail: file.name,
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi upload',
      detail: String(err),
      life: 4000
    });
  }
};

// ===== CREATE FOLDER =====
const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) return;
  try {
    const folder = await createNewAlbum(newFolderName.value.trim());
    items.value.unshift(folder);
    toast.add({
      severity: 'success',
      summary: 'Đã tạo thư mục',
      detail: folder.name,
      life: 3000
    });
    newFolderName.value = '';
    showCreateFolderDialog.value = false;
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi tạo thư mục',
      detail: String(err),
      life: 4000
    });
  }
};

// ===== ITEM ACTIONS =====
const handleOpenFolder = (item: StorageItem) => {
  if (item.type === 'folder') breadcrumb.value.push(item.name);
};
const handlePreview = (item: StorageItem) => {
  selectedItem.value = item;
  previewVisible.value = true;
};
const handleShare = (item: StorageItem) =>
  toast.add({ severity: 'info', summary: 'Chia sẻ', detail: item.name });
const handleDelete = (item: StorageItem) => {
  items.value = items.value.filter((i) => i.id !== item.id);
  toast.add({ severity: 'warn', summary: 'Đã xóa', detail: item.name });
};

// ===== VIEW / UTIL =====
const toggleView = () => (isListView.value = !isListView.value);
const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

onMounted(loadItems);
</script>

<style scoped>
.group:hover img {
  transform: scale(1.05);
}
.object-cover{
  width: 200px;
  aspect-ratio: 2/2;
  padding: 30px;
}

.ss{
    display: flex ;
    flex-wrap: wrap ;
}
.priview{
  margin-bottom: 181px;
}
</style>
