<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

// Import Components
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Image from 'primevue/image';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Tooltip from 'primevue/tooltip';

// Import Services & Types
import { fetchUserMedia, uploadNewItem, toggleFavorite, moveToTrash } from '../services/Item';
import type { StorageItem } from '../types/StorageItem';

// ============================================
// CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:8080';
const USER_ID = '68ea31f9b545a702d865f1d2';

// ============================================
// STATE MANAGEMENT
// ============================================
const toast = useToast();
const isLoading = ref(true);
const items = ref<StorageItem[]>([]);
const previewVisible = ref(false);
const currentItem = ref<StorageItem | null>(null);

// ============================================
// UTILITIES
// ============================================

const getItemUrl = (item: StorageItem): string => {
    return item.url ? `${API_BASE_URL}${item.url}` : '';
};

const isImage = (item: StorageItem): boolean => {
    const url = getItemUrl(item);
    return !!url.match(/\.(jpg|png|jpeg|gif|webp)$/i);
};

const isVideo = (item: StorageItem): boolean => {
    const url = getItemUrl(item);
    return !!url.match(/\.(webm|mp4|mov|avi)$/i);
};

const getFileIcon = (item: StorageItem) => {
    if (isImage(item)) return { icon: 'pi-image', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (isVideo(item)) return { icon: 'pi-video', color: 'text-red-600', bg: 'bg-red-50' };
    return { icon: 'pi-file', color: 'text-gray-600', bg: 'bg-gray-50' };
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// ============================================
// DATA OPERATIONS
// ============================================

const loadItems = async () => {
    isLoading.value = true;
    try {
        items.value = await fetchUserMedia(USER_ID);
    } catch (err) {
        console.error('❌ Error loading media:', err);
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách tệp',
            life: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

// ============================================
// FILE UPLOAD
// ============================================

const handleUpload = async (event: FileUploadSelectEvent) => {
    const files = event.files || [];
    if (!files.length) return;

    let uploadedCount = 0;

    for (const file of files) {
        try {
            const res = await uploadNewItem(file);
            if (res) uploadedCount++;
        } catch (error) {
            console.error('❌ Upload failed:', file.name, error);
        }
    }

    if (uploadedCount > 0) {
        toast.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã tải lên ${uploadedCount} tệp`,
            life: 3000
        });
        await loadItems();
    }
};

// ============================================
// ITEM ACTIONS
// ============================================

const handleFavoriteToggle = async (item: StorageItem, event?: Event) => {
    if (event) event.stopPropagation();
    
    const newStatus = !item.isFavorite;
    try {
        await toggleFavorite(item.id, newStatus);
        item.isFavorite = newStatus;
        
        toast.add({
            severity: 'info',
            summary: newStatus ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích',
            life: 2000
        });
    } catch (error) {
        console.error('❌ Error toggling favorite:', error);
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật',
            life: 3000
        });
    }
};

const handleDelete = async (item: StorageItem, event?: Event) => {
    if (event) event.stopPropagation();
    
    const confirmed = confirm(`Xóa "${item.filename}"?`);
    if (!confirmed) return;

    try {
        await moveToTrash(item.id);
        items.value = items.value.filter(it => it.id !== item.id);
        
        if (currentItem.value?.id === item.id) {
            previewVisible.value = false;
        }

        toast.add({
            severity: 'success',
            summary: 'Đã xóa',
            life: 2000
        });
    } catch (error) {
        console.error('❌ Error deleting:', error);
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể xóa',
            life: 3000
        });
    }
};

const openPreview = (item: StorageItem) => {
    currentItem.value = item;
    previewVisible.value = true;
};

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
    loadItems();
});
</script>

<template>
  <Toast />

  <div class="main-container text-[12px]">
    <!-- HEADER -->
    <header class="px-6 py-4 flex items-center justify-between border-b bg-white shadow-sm">
      <h1 class="text-2xl font-medium text-gray-800">Media Của Tôi</h1>
      <FileUpload
        mode="basic"
        name="files[]"
        :customUpload="true"
        :auto="false"
        chooseLabel="Tải lên"
        icon="pi pi-upload"
        :maxFileSize="100000000"
        @select="handleUpload"
        severity="secondary"
        class="upload-button"
      />
    </header>

    <!-- CONTENT -->
    <div class="p-6 bg-gray-50 min-h-[70vh] " id="cart">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
      </div>

      <!-- FILE CARDS -->
      <div
        v-else-if="items.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-4 container"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
          @click="openPreview(item)"
        >
          <!-- Thumbnail -->
          <div class="relative w-full aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden s">
            <img
              v-if="isImage(item)"
              :src="getItemUrl(item)"
              :alt="item.filename"
              loading="lazy"
              class="w-full h-full object-cover cart"
            />

            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center bg-gray-50"
            >
              <i
                :class="['pi', getFileIcon(item).icon, 'text-5xl', getFileIcon(item).color]"
              ></i>
              <p class="text-[10px] text-gray-500 mt-1">
                {{ isVideo(item) ? 'Video' : 'Tệp' }}
              </p>
            </div>

            <!-- Favorite Icon -->
            <div
              v-if="item.isFavorite"
              class="absolute top-2 left-2 bg-black/40 rounded-full p-1"
            >
              <i class="pi pi-star-fill text-yellow-400 text-xs"></i>
            </div>
          </div>

          <!-- INFO -->
          <div class="p-2 border-t text-[11px] leading-snug">
            <p
              class="font-medium text-gray-800 truncate"
              :title="item.filename"
            >
              {{ item.filename }}
            </p>
            <p class="text-gray-500 text-[10px] mt-1">
              {{ formatDate(item.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- EMPTY -->
      <div v-else class="text-center py-20">
        <div
          class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4"
        >
          <i class="pi pi-inbox text-5xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-normal text-gray-900 mb-2">
          Không có tệp nào
        </h3>
        <p class="text-gray-500">Tải lên tệp đầu tiên của bạn</p>
      </div>
    </div>
  </div>

  <!-- DIALOG -->
  <Dialog
    v-model:visible="previewVisible"
    modal
    maximizable
    :style="{ width: '90vw', maxWidth: '1200px' }"
    :contentStyle="{ padding: 0 }"
    class="preview-dialog"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-4 text-[12px]">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <i
            :class="['pi', getFileIcon(currentItem!).icon, getFileIcon(currentItem!).color, 'text-lg']"
          ></i>
          <span class="font-medium text-gray-900 truncate">
            {{ currentItem?.filename }}
          </span>
        </div>
        <div class="flex gap-2">
          <Button
            :icon="currentItem?.isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"
            :class="currentItem?.isFavorite ? 'text-yellow-500' : ''"
            text
            rounded
            @click="currentItem && handleFavoriteToggle(currentItem)"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            @click="currentItem && handleDelete(currentItem)"
          />
        </div>
      </div>
    </template>

    <!-- PREVIEW CONTENT -->
    <div class="bg-gray-50">
      <div class="flex justify-center items-center min-h-[70vh] p-8 bg-gray-100">
        <Image
          v-if="currentItem && isImage(currentItem)"
          :src="getItemUrl(currentItem)"
          :alt="currentItem.filename"
          preview
          class="max-h-[70vh] max-w-full"
          imageClass="max-h-[70vh] w-auto h-auto object-contain"
        />
        <video
          v-else-if="currentItem && isVideo(currentItem)"
          :src="getItemUrl(currentItem)"
          controls
          autoplay
          class="max-h-[70vh] max-w-full rounded-lg shadow-lg"
        />
        <div v-else class="text-center p-12">
          <i class="pi pi-file text-7xl text-gray-300 mb-4"></i>
          <p class="text-lg text-gray-600">Không thể xem trước</p>
          <p class="text-sm text-gray-500 mt-2">
            {{ currentItem?.filename }}
          </p>
        </div>
      </div>

      <div class="bg-white border-t p-6 text-[12px]">
        <h3 class="font-medium text-gray-900 mb-4">Chi tiết</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-500">Loại</span>
            <span class="text-gray-900">{{ fileTypeLabel }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Đã sửa đổi</span>
            <span class="text-gray-900">{{ formatDate(currentItem?.createdAt) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Yêu thích</span>
            <span class="text-gray-900">{{ currentItem?.isFavorite ? 'Có' : 'Không' }}</span>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>


<style scoped>
/* ============================================
   1. GLOBAL LAYOUT
   ============================================ */

.main-container {
  min-height: 100vh;
  background-color: #f7f9fc; /* Màu nền nhẹ hơn, giống Material */
}

.main-header {
  border-bottom: 1px solid #e8eaed; /* Đường viền mỏng, nhẹ */
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.content-area {
  padding: 1.5rem;
  font-size: small;
}

/* ============================================
   2. UPLOAD BUTTON (Material Style)
   ============================================ */

.upload-button :deep(.p-button) {
  background: white;
  color: #3c4043; /* Màu chữ xám Google */
  border: 1px solid #dadce0;
  font-weight: 500;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.5, 1); /* Transition mượt hơn */
  border-radius: 8px; /* Bo tròn hơn */
}

.upload-button :deep(.p-button:hover) {
  background: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1), 0 1px 3px 1px rgba(60, 64, 67, 0.05); /* Bóng nhẹ */
}

/* ============================================
   3. FILE CARD (Google Drive Look)
   ============================================ */

.file-card {
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
  border-radius: 8px; /* Bo tròn cho card */
}

.thumbnail-wrapper {
  border: 1px solid transparent; /* Tạo không gian cho border hover */
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* Hiệu ứng Google Drive: Border xanh khi hover */
.file-card:hover .thumbnail-wrapper {
  border-color: #4285f4; /* Màu xanh Google */
  box-shadow: 0 1px 3px rgba(66, 133, 244, 0.2); /* Bóng nhẹ màu xanh */
}

/* Nút Action trên Overlay */
.action-button {
  width: 2rem !important; /* !w-8 */
  height: 2rem !important; /* !h-8 */
  border-radius: 50%;
  transition: background-color 0.2s;
}

/* ============================================
   4. PRIME VUE OVERRIDES
   ============================================ */

/* Dialog styling */
.preview-dialog :deep(.p-dialog-header) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.preview-dialog :deep(.p-dialog-content) {
  padding: 0;
}

/* Star button color fix */
.p-button.text-yellow-400 {
  color: #fcc419 !important; /* Màu vàng chuẩn hơn */
}

.p-button.text-yellow-500 {
  color: #f59e0b !important;
}
.content-area {
  font-size: 1%;
}
.file-card p {
  font-size: 1px;
}
.cart{
  width: 100px;
  aspect-ratio: 2/2;
}
 .s{
  border: solid 1px black;
  width: max-content;
 }
 
 .container{
  display: flex;
    flex-wrap: wrap;

 }
</style>  