<script setup>
import { ref, onMounted } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptionsComp from 'primevue/dataviewlayoutoptions';
import FileItemDisplay from '../../components/FileItemDisplay.vue';
import { fileData } from '../../graphql/FakeData.js';

const publicItems = ref([]);
const layout = ref('grid');

const fetchPublicItems = async () => {
    // Logic: Lấy TẤT CẢ mục CÓ isPublic = true và KHÔNG bị xóa
    publicItems.value = fileData.data.getUserItems.filter(item => item.isPublic && !item.isDeleted);
};

onMounted(fetchPublicItems);
</script>

<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-4">Album Công Khai</h1>
        <p class="mb-4 text-gray-600">Đây là các mục đã được đánh dấu là Công khai.</p>

        <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <span class="text-lg font-medium text-gray-700">Tổng cộng: {{ publicItems.length }} mục</span>
            <DataViewLayoutOptionsComp v-model:layout="layout" />
        </div>

        <DataView :value="publicItems" :layout="layout" :paginator="true" :rows="16">
            <template #list="slotProps"><FileItemDisplay :item="slotProps.data" layout="list" /></template>
            <template #grid="slotProps"><FileItemDisplay :item="slotProps.data" layout="grid" /></template>
            <template #empty><div class="text-center p-5 text-gray-500">Không có mục công khai.</div></template>
        </DataView>
    </div>
</template>