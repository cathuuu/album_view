<script setup>
import { ref, onMounted } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptionsComp from 'primevue/dataviewlayoutoptions';
import FileItemDisplay from '../components/FileItemDisplay.vue';
import Button from 'primevue/button';
import { fileData } from '../graphql/FakeData.js'; 

const trashItems = ref([]);
const layout = ref('list');

const fetchTrashItems = async () => {
    // Logic: Lấy TẤT CẢ mục CÓ isDeleted = true
    trashItems.value = fileData.data.getUserItems.filter(item => item.isDeleted);
};

const emptyTrash = () => {
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tất cả các mục trong Thùng rác không?")) {
        trashItems.value = [];
        alert("Thùng rác đã được dọn sạch.");
        // TODO: Gửi request API để xóa toàn bộ
    }
}

onMounted(fetchTrashItems);
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold">Thùng Rác</h1>
            <Button 
                label="Dọn Sạch Thùng Rác" 
                icon="pi pi-times" 
                severity="danger" 
                :disabled="trashItems.length === 0"
                @click="emptyTrash"
            />
        </div>

        <DataView :value="trashItems" :layout="layout">
            <template #header v-if="layout === 'list'">
                <div class="flex items-center font-bold text-gray-700 p-3 border-b-2 border-gray-300">
                    <div class="w-1/12"></div><div class="w-4/12">Tên Mục</div><div class="w-2/12">Kích Thước</div>
                    <div class="w-4/12">Ngày Xóa (Giả định)</div><div class="w-1/12 text-right"></div>
                </div>
            </template>
            <template #list="slotProps"><FileItemDisplay :item="slotProps.data" layout="list" /></template>
            <template #grid="slotProps"><FileItemDisplay :item="slotProps.data" layout="grid" /></template>
            <template #empty><div class="text-center p-5 text-gray-500">Thùng rác trống.</div></template>
        </DataView>
    </div>
</template>