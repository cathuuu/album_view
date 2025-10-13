<script setup>
import { ref, onMounted } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptionsComp from 'primevue/dataviewlayoutoptions';
import FileItemDisplay from '../components/FileItemDisplay.vue';
import { fileData } from '../graphql/FakeData.js'; 

const favoriteItems = ref([]);
const layout = ref('grid');

const fetchFaverItems = async () => {
    // Logic: Lấy TẤT CẢ mục CÓ isFavorite = true và KHÔNG bị xóa
    favoriteItems.value = fileData.data.getUserItems.filter(item => item.isFavorite && !item.isDeleted);
};

onMounted(fetchFaverItems);
</script>

<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-4">Yêu Thích</h1>

        <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <span class="text-lg font-medium text-gray-700">Tổng cộng: {{ favoriteItems.length }} mục</span>
            <DataViewLayoutOptionsComp v-model:layout="layout" />
        </div>

        <DataView :value="favoriteItems" :layout="layout" :paginator="true" :rows="16">
            <template #list="slotProps"><FileItemDisplay :item="slotProps.data" layout="list" /></template>
            <template #grid="slotProps"><FileItemDisplay :item="slotProps.data" layout="grid" /></template>
            <template #empty><div class="text-center p-5 text-gray-500">Bạn chưa thêm mục nào vào Yêu Thích.</div></template>
        </DataView>
    </div>
</template>