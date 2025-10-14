<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Image from 'primevue/image';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import { fetchAllItems, uploadNewItem, toggleFavorite, moveToTrash } from '../services/Item';
import type { StorageItem } from '../types/StorageItem';


// state
const isLoading = ref<boolean>(true);
const items = ref<StorageItem[]>([]);
const previewVisible = ref<boolean>(false);
const currentItem = ref<StorageItem | null>(null);

// load data
const loadItems = async () => {
    isLoading.value = true;
    try {
        items.value = await fetchAllItems();
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách tệp.' });
    } finally {
        isLoading.value = false;
    }
};

// upload
const toast = useToast();

const handleUpload = async (event: FileUploadSelectEvent) => {
  const files = event.files || [];
  if (!files.length) return;

  toast.add({
    severity: 'info',
    summary: 'Đang tải lên...',
    detail: `Đang xử lý ${files.length} tệp...`,
    life: 2500,
  });

  const uploaded: StorageItem[] = [];

  for (const file of files) {
    try {
      const res = await uploadNewItem(file);
      if (res) {
        uploaded.push(res);
        console.log('✅ Upload thành công:', res.filename);
      } else {
        console.warn('⚠️ Không nhận được dữ liệu trả về cho file:', file.name);
      }
    } catch (e) {
      console.error('❌ Upload thất bại:', file.name, e);
      toast.add({
        severity: 'error',
        summary: 'Lỗi tải lên',
        detail: `Không thể tải tệp ${file.name}`,
        life: 3000,
      });
    }
  }

  if (uploaded.length > 0) {
    toast.add({
      severity: 'success',
      summary: 'Hoàn tất',
      detail: `Đã tải lên ${uploaded.length} / ${files.length} tệp thành công!`,
      life: 3000,
    });

    await loadItems(); // ✅ load lại danh sách mới nhất
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Thất bại',
      detail: 'Không có tệp nào được tải lên.',
      life: 3000,
    });
  }
};

// yêu thích
const handleFavoriteToggle = async (item: StorageItem) => {
    const newStatus = !item.isFavorite;
    const result = await toggleFavorite(item.id, newStatus);
    if (result.success) {
        item.isFavorite = newStatus;
    }
};

// xoá mềm
const handleDelete = async (item: StorageItem) => {
    if (!confirm(`Bạn có chắc muốn xoá "${item.filename}"?`)) return;
    const result = await moveToTrash(item.id);
    if (result.success) {
        items.value = items.value.filter(it => it.id !== item.id);
        toast.add({ severity: 'success', summary: 'Đã xoá', detail: 'Tệp đã được chuyển vào thùng rác.', life: 2000 });
    }
};

// xem chi tiết
const openPreview = (item: StorageItem) => {
    currentItem.value = item;
    previewVisible.value = true;
};

onMounted(loadItems);
</script>

<template>
    <Toast />

    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800">Thư viện của tôi</h2>

            <FileUpload
                mode="basic"
                name="files[]"
                :customUpload="true"
                :auto="false"
                chooseLabel="Tải lên"
                icon="pi pi-upload"
                :maxFileSize="100000000"
                @select="handleUpload"
                class="p-button-rounded p-button-success"
            />
        </div>

        <!-- trạng thái loading -->
        <div v-if="isLoading" class="flex justify-center items-center py-20 text-gray-500">
            <i class="pi pi-spin pi-spinner text-2xl mr-2"></i> Đang tải dữ liệu...
        </div>

        <!-- danh sách dạng lưới -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
                v-for="item in items"
                :key="item.id"
                class="group relative border rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            >
                <div class="relative">
                    <!-- hiển thị ảnh -->
                    <img
                        v-if="item.type === 'photo' && item.url"
                        :src="item.url"
                        :alt="item.filename"
                        class="object-cover w-full h-48 cursor-pointer"
                        @click="openPreview(item)"
                    />
                    <!-- file khác -->
                    <div
                        v-else
                        class="flex flex-col justify-center items-center w-full h-48 bg-gray-100 cursor-pointer"
                        @click="openPreview(item)"
                    >
                        <i class="pi pi-file text-5xl text-gray-400 mb-2"></i>
                        <p class="text-gray-600 text-sm truncate px-2">{{ item.filename }}</p>
                    </div>

                    <!-- action overlay -->
                    <div
                        class="absolute top-0 right-0 flex flex-col opacity-0 group-hover:opacity-100 transition bg-black/40 p-2 rounded-bl-lg"
                    >
                        <Button
                            icon="pi pi-heart"
                            text
                            size="small"
                            :class="item.isFavorite ? 'text-red-400' : 'text-white'"
                            @click.stop="handleFavoriteToggle(item)"
                            v-tooltip.bottom="'Yêu thích'"
                        />
                        <Button
                            icon="pi pi-trash"
                            text
                            size="small"
                            class="text-white"
                            @click.stop="handleDelete(item)"
                            v-tooltip.bottom="'Xoá'"
                        />
                    </div>
                </div>

                <!-- footer -->
                <div class="p-2 text-center bg-white">
                    <p class="text-sm font-semibold truncate">{{ item.filename }}</p>
                </div>
            </div>
        </div>

        <!-- rỗng -->
        <div v-if="!isLoading && items.length === 0" class="text-center text-gray-500 mt-10">
            <p>Chưa có tệp nào. Hãy thử tải lên!</p>
        </div>
    </div>

    <!-- Dialog xem ảnh -->
    <Dialog
        v-model:visible="previewVisible"
        :header="currentItem?.filename"
        modal
        :style="{ width: '80vw' }"
    >
        <div class="flex justify-center items-center p-4">
            <Image
                v-if="currentItem?.type === 'photo'"
                :src="currentItem.url"
                :alt="currentItem.filename"
                preview
                class="max-h-[70vh] rounded shadow-lg"
            />
            <div v-else class="text-center text-gray-600">
                <i class="pi pi-file text-6xl mb-3"></i>
                <p class="text-lg font-medium">Không có xem trước trực tiếp</p>
                <p class="text-sm">{{ currentItem?.filename }}</p>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.p-fileupload .p-button {
    background-color: #4caf50;
    border: none;
}
</style>
