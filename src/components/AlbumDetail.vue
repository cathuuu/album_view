<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // Để lấy ID từ URL
import Button from 'primevue/button';
// ... (Các imports khác cần thiết: DataView, FileItemDisplay, ItemService)

const route = useRoute();
const albumId = route.params.id as string;
const albumName = ref<string>('Đang tải...');
const albumContents = ref<any[]>([]); // Dữ liệu bên trong album
const isLoading = ref<boolean>(true);

const fetchAlbumDetails = async () => {
    isLoading.value = true;
    // 💡 Logic thực tế: Gọi ItemService để lấy chi tiết Album (AlbumName) 
    // và các mục con (AlbumContents) bằng albumId.
    
    // Giả lập
    await new Promise(resolve => setTimeout(resolve, 300));
    albumName.value = `Album: ${albumId}`;
    albumContents.value = [ /* Thêm các mục con giả lập ở đây */ ]; 
    isLoading.value = false;
};

onMounted(fetchAlbumDetails);
</script>

<template>
    <div class="p-6">
        <Button icon="pi pi-arrow-left" label="Quay lại" text @click="$router.go(-1)" class="mb-4" />
        <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ albumName }}</h1>
        
        <div v-if="isLoading" class="text-center p-10 text-xl text-blue-500">
            <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Đang tải nội dung...
        </div>
        
        <div v-else>
            <p v-if="albumContents.length === 0" class="text-gray-500">Album này hiện chưa có nội dung.</p>
            </div>
    </div>
</template>