<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog';
import Image from 'primevue/image';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FolderView from '../components/FolderView.vue';
import { getItemIcon, formatSize } from '../utils/itemUtils';
import { fetchAllItems, toggleFavorite, moveToTrash, uploadNewItem } from '../services/Item';
import type { StorageItem } from '../types/StorageItem';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const isLoading = ref<boolean>(true);
const allItems = ref<StorageItem[]>([]);
const previewVisible = ref<boolean>(false);
const currentItem = ref<StorageItem | null>(null);

const displayItems = computed<StorageItem[]>(() => {
    return allItems.value.filter(item => !item.isDeleted);
});

const loadData = async () => {
    isLoading.value = true;
    try {
        allItems.value = await fetchAllItems();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        allItems.value = [];
    } finally {
        isLoading.value = false;
    }
};

const handleUpload = async (event: FileUploadSelectEvent) => {
    if (!event.files || event.files.length === 0) return;
    const file = event.files[0];
    try {
        toast.add({ severity: 'info', summary: 'Đang tải lên', detail: `Đang xử lý tệp ${file.name}...`, life: 5000 });
        const newItem = await uploadNewItem(file);
        allItems.value.unshift(newItem);
        toast.add({ severity: 'success', summary: 'Thành công', detail: `Tải lên tệp ${newItem.name} hoàn tất!`, life: 3000 });
    } catch (error) {
        console.error('Lỗi tải lên:', error);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Không thể tải lên tệp.', life: 3000 });
    }
};

const handleItemClick = (item: StorageItem) => {
    if (item.isAlbum) {
        router.push({ name: 'AlbumDetail', params: { id: item.id } });
    } else {
        currentItem.value = item;
        previewVisible.value = true;
    }
};

const handleFavoriteToggle = async (itemId: string, isFavorite: boolean) => {
    const response = await toggleFavorite(itemId, isFavorite);
    if (response.success) {
        const itemToUpdate = allItems.value.find(item => item.id === itemId);
        if (itemToUpdate) itemToUpdate.isFavorite = isFavorite;
    }
};

const handleDeleteItem = async (itemId: string) => {
    if (confirm('Bạn có chắc chắn muốn chuyển mục này vào Thùng rác?')) {
        const response = await moveToTrash(itemId);
        if (response.success) {
            const itemToUpdate = allItems.value.find(item => item.id === itemId);
            if (itemToUpdate) itemToUpdate.isDeleted = true;
        }
    }
};

onMounted(loadData);
</script>

<template>
    <Toast />
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-4 text-gray-800">Ảnh & Tệp Đã Tải Lên</h1>

        <div class="flex justify-end mb-4 p-3 border-b border-gray-200">
            <FileUpload
                mode="basic"
                name="demo[]"
                url="/api/upload"
                :maxFileSize="100000000"
                @select="handleUpload"
                :auto="false"
                customUpload
                chooseLabel="Tải Lên Tệp Tin"
                icon="pi pi-upload"
            />
        </div>

        <FolderView
            :items="displayItems"
            :isLoading="isLoading"
            :rows="16"
            :showBreadcrumb="false"
            emptyMessage="Không tìm thấy mục nào. Hãy thử tải lên một tệp mới!"
            @item-click="handleItemClick"
            @favorite-toggle="handleFavoriteToggle"
            @delete-item="handleDeleteItem"
        >
            <template #list-header>
                <div class="grid grid-cols-12 font-semibold text-gray-600 p-3 bg-gray-50 border-y border-gray-300 rounded-t-lg">
                    <div class="col-span-6">Tên Mục</div>
                    <div class="col-span-2 text-right">Kích Thước</div>
                    <div class="col-span-3 text-right">Ngày Tải Lên</div>
                    <div class="col-span-1"></div>
                </div>
            </template>
        </FolderView>
    </div>
    
    <Dialog 
        v-model:visible="previewVisible" 
        :header="currentItem?.name || 'Xem trước Tệp'" 
        :modal="true" 
        :draggable="false" 
        :style="{ width: '80vw' }"
        :contentStyle="{ padding: '0' }"
        headerClass="border-b"
    >
        <template #footer>
            <Button label="Đóng" @click="previewVisible = false" icon="pi pi-times" severity="secondary" />
        </template>
        
        <div v-if="currentItem" class="grid grid-cols-1 md:grid-cols-3 h-full">
            <div class="md:col-span-2 flex items-center justify-center p-4 bg-gray-100 min-h-[500px]">
                <div v-if="currentItem.type === 'image'">
                    <Image 
                        :src="currentItem.uri || 'https://via.placeholder.com/600x400?text=Image+Not+Available'" 
                        :alt="currentItem.name" 
                        preview 
                        class="block max-h-[70vh] w-auto"
                        imageClass="rounded"
                    />
                </div>
                <div v-else class="text-center p-10">
                    <i :class="[getItemIcon(currentItem.type, currentItem.isAlbum), 'text-8xl text-gray-500 mb-4']"></i>
                    <p class="text-lg font-semibold">Không có xem trước trực tiếp</p>
                    <p class="text-sm text-gray-500">Loại tệp: {{ currentItem.type }}. Kích thước: {{ formatSize(currentItem.size) }}.</p>
                </div>
            </div>

            <div class="md:col-span-1 p-5 border-l">
                <h3 class="text-xl font-bold mb-4 border-b pb-2">Chi tiết Tệp</h3>
                
                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-600">Tên Tệp</p>
                    <p class="text-base break-words">{{ currentItem.name }}</p>
                </div>
                
                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-600">Ngày Tải Lên</p>
                    <p class="text-base">{{ currentItem.uploadedDate }}</p>
                </div>

                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-600">Kích Thước</p>
                    <p class="text-base">{{ formatSize(currentItem.size) }}</p>
                </div>

                <div class="mb-4 flex items-center">
                    <i :class="['text-lg mr-2', currentItem.isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart']"></i>
                    <span :class="{'text-red-500': currentItem.isFavorite}">{{ currentItem.isFavorite ? 'Đã Yêu Thích' : 'Chưa Yêu Thích' }}</span>
                </div>
            </div>
        </div>
    </Dialog>
</template>