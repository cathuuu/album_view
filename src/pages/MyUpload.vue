<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
// Import Components
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Image from 'primevue/image';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Tooltip from 'primevue/tooltip'; // Đảm bảo bạn đã đăng ký Directive này toàn cục hoặc cục bộ

// Import Services & Types
import { fetchUserMedia, uploadNewItem, toggleFavorite, moveToTrash } from '../services/Item';
import type { StorageItem } from '../types/StorageItem';

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:8080';
const USER_ID = '68ea31f9b545a702d865f1d2'; // 👈 Cần thay bằng logic User Authentication thực tế

// --- STATE ---
const toast = useToast();
const isLoading = ref(true);
const items = ref<StorageItem[]>([]);
const previewVisible = ref(false);
const currentItem = ref<StorageItem | null>(null);

// --- UTILITIES (Computed properties) ---

/**
 * Tạo URL hoàn chỉnh từ đường dẫn tương đối của item
 */
const getItemUrl = (item: StorageItem): string => {
    return item.url ? `${API_BASE_URL}${item.url}` : '';
};

/**
 * Kiểm tra xem tệp có phải là ảnh không
 */
const isImage = (item: StorageItem): boolean => {
    const url = getItemUrl(item);
    return !!url.match(/\.(jpg|png|jpeg)$/i);
};

/**
 * Kiểm tra xem tệp có phải là video webm không
 */
const isWebmVideo = (item: StorageItem): boolean => {
    const url = getItemUrl(item);
    return url.endsWith('.webm');
};


// -----------------------------
// 📦 DATA LOADING
// -----------------------------
const loadItems = async () => {
    isLoading.value = true;
    try {
        items.value = await fetchUserMedia(USER_ID);
    } catch (err) {
        console.error('❌ Lỗi khi tải danh sách media:', err);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách tệp.', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// -----------------------------
// 📤 UPLOAD HANDLER
// -----------------------------
const handleUpload = async (event: FileUploadSelectEvent) => {
    const files = event.files || [];
    if (!files.length) return;

    toast.add({
        severity: 'info',
        summary: 'Đang tải lên...',
        detail: `Đang xử lý ${files.length} tệp...`,
        life: 5000,
    });

    const uploadedCount = ref(0);
    const totalFiles = files.length;

    for (const file of files) {
        try {
            const res = await uploadNewItem(file);
            if (res) uploadedCount.value++;
        } catch (e) {
            console.error('❌ Upload thất bại:', file.name, e);
            toast.add({
                severity: 'error',
                summary: 'Tải lên thất bại',
                detail: `Không thể tải ${file.name}`,
                life: 3000,
            });
        }
    }

    // Cập nhật thông báo cuối cùng
    if (uploadedCount.value > 0) {
        toast.add({
            severity: 'success',
            summary: 'Hoàn tất',
            detail: `Đã tải lên ${uploadedCount.value}/${totalFiles} tệp thành công!`,
            life: 4000,
        });
        await loadItems();
    } else if (totalFiles > 0) {
        toast.add({
            severity: 'warn',
            summary: 'Thất bại',
            detail: 'Không có tệp nào được tải lên thành công.',
            life: 3000,
        });
    }
};

// -----------------------------
// ❤️ ACTIONS
// -----------------------------
const handleFavoriteToggle = async (item: StorageItem) => {
    const newStatus = !item.isFavorite;
    try {
        await toggleFavorite(item.id, newStatus);
        item.isFavorite = newStatus;
        toast.add({
            severity: 'info',
            summary: newStatus ? 'Đã thêm Yêu thích' : 'Đã bỏ Yêu thích',
            detail: item.filename,
            life: 2000,
        });
    } catch {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật yêu thích.', life: 3000 });
    }
};

const handleDelete = async (item: StorageItem) => {
    if (!confirm(`Bạn có chắc muốn xoá "${item.filename}"? (Tệp sẽ chuyển vào thùng rác)`)) return;
    try {
        await moveToTrash(item.id);
        // Xóa khỏi danh sách hiện tại
        items.value = items.value.filter(it => it.id !== item.id);
        toast.add({ severity: 'success', summary: 'Đã chuyển vào thùng rác', detail: item.filename, life: 2000 });
    } catch {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xoá tệp.', life: 3000 });
    }
};

// -----------------------------
// 🔍 PREVIEW
// -----------------------------
const openPreview = (item: StorageItem) => {
    currentItem.value = item;
    previewVisible.value = true;
};

// --- LIFECYCLE HOOKS ---
onMounted(loadItems);
</script>
<template>
  <Toast />

  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
      <h2 class="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
        <i class="pi pi-images text-teal-600"></i> Thư viện của tôi
      </h2>

      <FileUpload
        mode="basic"
        name="files[]"
        :customUpload="true"
        :auto="false"
        chooseLabel="Tải lên"
        icon="pi pi-cloud-upload"
        :maxFileSize="100000000"
        @select="handleUpload"
        class="p-button-rounded p-button-success"
      />
    </div>

    <div v-if="isLoading" class="flex flex-col justify-center items-center py-20 text-gray-500">
      <i class="pi pi-spin pi-spinner text-4xl mr-2 mb-3 text-teal-500"></i>
      <span class="text-lg font-medium">Đang tải dữ liệu...</span>
    </div>

    <div
      v-else-if="items.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:border-blue-400"
      >
        <div 
          class="relative w-full aspect-[4/3] bg-gray-100 flex justify-center items-center overflow-hidden cursor-pointer"
          @click="openPreview(item)"
        >
          <img
            v-if="isImage(item)"
            :src="getItemUrl(item)"
            :alt="item.filename"
            loading="lazy"
            class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />

          <div v-else-if="isWebmVideo(item)" class="text-center text-gray-500 p-4">
              <i class="pi pi-video text-5xl mb-1 text-red-500"></i>
              <p class="text-xs font-medium">Video Preview</p>
          </div>

          <div
            v-else
            class="text-center text-gray-500 p-4"
          >
            <i class="pi pi-file text-6xl text-gray-400"></i>
          </div>

          <div 
            class="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            @click.stop
          >
            <Button
                :icon="item.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"
                rounded
                size="small"
                text
                :severity="item.isFavorite ? 'danger' : 'secondary'"
                class="bg-white/90 shadow-md !w-8 !h-8"
                @click="handleFavoriteToggle(item)"
                v-tooltip.left="item.isFavorite ? 'Đã yêu thích' : 'Thêm yêu thích'"
            />
            <Button
                icon="pi pi-trash"
                rounded
                size="small"
                text
                severity="danger"
                class="bg-white/90 shadow-md !w-8 !h-8"
                @click="handleDelete(item)"
                v-tooltip.left="'Xoá (Thùng rác)'"
            />
          </div>
        </div>

        <div class="flex items-center p-2">
            <i 
                :class="{ 
                    'pi pi-image text-green-500': isImage(item),
                    'pi pi-video text-red-500': isWebmVideo(item),
                    'pi pi-file text-gray-400': !isImage(item) && !isWebmVideo(item)
                }"
                class="text-base mr-2"
            ></i>
            <p class="text-sm font-medium truncate text-gray-800 flex-grow" @click="openPreview(item)">
                {{ item.filename }}
            </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-20 p-10 bg-white rounded-xl shadow">
      <i class="pi pi-inbox text-7xl mb-4 text-teal-400"></i>
      <p class="text-xl font-medium">Chưa có tệp nào!</p>
      <p>Hãy là người đầu tiên tải lên tệp của bạn.</p>
    </div>
  </div>

  <Dialog
    v-model:visible="previewVisible"
    :header="currentItem?.filename"
    modal
    :maximizable="true"
    :style="{ width: '90vw', maxWidth: '1200px' }"
    contentClass="p-0"
  >
    <div class="flex justify-center items-center h-full max-h-[80vh]">
      <Image
        v-if="currentItem && isImage(currentItem)"
        :src="getItemUrl(currentItem)"
        :alt="currentItem.filename"
        preview
        indicatorIcon="pi pi-search-plus"
        class="max-h-[80vh] max-w-full rounded-lg"
        imageClass="max-h-[80vh] w-auto h-auto object-contain"
      />
      <video
        v-else-if="currentItem && isWebmVideo(currentItem)"
        :src="getItemUrl(currentItem)"
        controls
        autoplay
        class="max-h-[80vh] max-w-full w-auto h-auto rounded-lg bg-black"
      />
      <div v-else class="text-center text-gray-600 p-8">
        <i class="pi pi-file text-7xl mb-3"></i>
        <p class="text-xl font-semibold">Không thể xem trước</p>
        <p class="text-base">{{ currentItem?.filename }}</p>
      </div>
    </div>
  </Dialog>
</template>
<style scoped>
/* Màu sắc tươi mới cho nút tải lên */
.p-fileupload :deep(.p-button) {
  background-color: #0d9488; /* Teal 600 */
  border: none;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  transition: background-color 0.3s;
}

.p-fileupload :deep(.p-button:hover) {
  background-color: #14b8a6; /* Teal 500 */
}

/* Tối ưu Dialog Header */
.p-dialog :deep(.p-dialog-header) {
  font-weight: 700;
  font-size: 1.25rem; /* Tên file to và rõ ràng hơn */
  color: #1f2937;
}
</style>