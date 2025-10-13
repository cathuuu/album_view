<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptionsComp from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';       
import InputText from 'primevue/inputtext'; 
import Button from 'primevue/button';       
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FileItemDisplay from '../../components/FileItemDisplay.vue';
import { createNewAlbum, fetchAllItems } from '../../services/Item'; 
import type { StorageItem } from '../../types/StorageItem';
import { useRouter } from 'vue-router'; // <-- Cần import useRouter

// Định nghĩa kiểu dữ liệu cho DataView Slot Props
interface DataViewItemSlotProps {
    data: StorageItem;
    index: number;
}

const toast = useToast();
const router = useRouter(); // <-- Khởi tạo Router
const isLoading = ref<boolean>(true);
const allItems = ref<StorageItem[]>([]);
const layout = ref<'grid' | 'list'>('grid'); 

const createFolderVisible = ref<boolean>(false);
const newFolderName = ref<string>('');

const privateItems = computed<StorageItem[]>(() => {
    return allItems.value.filter(item => !item.isPublic && !item.isDeleted);
});

const loadData = async () => {
    isLoading.value = true;
    try {
        allItems.value = await fetchAllItems(); 
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        allItems.value = [];
    } finally {
        isLoading.value = false;
    }
};

const handleCreateFolder = async () => {
    // ... (Logic tạo thư mục giữ nguyên)
    if (!newFolderName.value.trim()) {
        toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên thư mục không được để trống.', life: 3000 });
        return;
    }

    try {
        const albumName = newFolderName.value.trim();
        toast.add({ severity: 'info', summary: 'Đang xử lý', detail: `Đang tạo thư mục "${albumName}"...`, life: 3000 });

        const newAlbum = await createNewAlbum(albumName);

        allItems.value.unshift(newAlbum); 

        toast.add({ severity: 'success', summary: 'Thành công', detail: `Đã tạo thư mục "${newAlbum.name}"!`, life: 3000 });

        createFolderVisible.value = false;
        newFolderName.value = '';

    } catch (error) {
        console.error("Lỗi tạo thư mục:", error);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Không thể tạo thư mục.', life: 3000 });
    }
};

// --- LOGIC XỬ LÝ NHẤP (MỚI) ---
const handleItemClick = (item: StorageItem) => {
    if (item.isAlbum) {
        // 💡 Điều hướng đến trang chi tiết Album
        router.push({ name: 'AlbumDetail', params: { id: item.id } });
    } else {
        // Hiện thông báo hoặc mở preview (giống MyUpload.vue)
        alert(`Mở tệp tin để xem trước: ${item.name}`);
    }
};

onMounted(loadData);

// Giả định rằng bạn sẽ thêm handleFavoriteToggle và handleDeleteItem nếu cần
// để hoàn thiện tương tác trên view này.
</script>

---

<template>
    <Toast />
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-4 text-gray-800">Album Riêng Tư</h1>
        <p class="mb-4 text-gray-600">Đây là các mục chỉ bạn mới có quyền truy cập.</p>

        <div class="flex justify-between items-center mb-4 p-3 border-b border-gray-200">
            <Button 
                label="Tạo Thư Mục" 
                icon="pi pi-folder-open" 
                severity="primary" 
                @click="createFolderVisible = true"
            />
            
            <DataViewLayoutOptionsComp v-model:layout="layout" />
        </div>
        
        <div v-if="isLoading" class="text-center p-10 text-xl text-blue-500">
            <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Đang tải dữ liệu...
        </div>

        <div v-else>
            <div class="mb-4 text-sm text-gray-600">
                Tổng cộng: **{{ privateItems.length }} mục**
            </div>
            
            <DataView :value="privateItems" :layout="layout" :paginator="true" :rows="16" dataKey="id">
                
                <template #list="slotProps">
                    <FileItemDisplay 
                        :item="slotProps.items" 
                        layout="list" 
                        @item-click="handleItemClick"
                    />
                </template>
                
                <template #grid="slotProps">
                    <FileItemDisplay 
                        :item="slotProps.items" 
                        layout="grid" 
                        @item-click="handleItemClick"
                    />
                </template>
                
                <template #empty>
                    <div class="text-center p-5 text-gray-500">Không có mục riêng tư. Hãy tạo một thư mục mới!</div>
                </template>
            </DataView>
        </div>
    </div>
    
    <Dialog 
        v-model:visible="createFolderVisible" 
        header="Tạo Thư Mục Mới" 
        :modal="true" 
        class="w-full md:w-3/12"
    >
        <div class="p-fluid">
            <div class="field">
                <label for="folderName" class="font-semibold mb-2 block">Tên Thư Mục</label>
                <InputText 
                    id="folderName" 
                    v-model="newFolderName" 
                    placeholder="Nhập tên thư mục" 
                    @keyup.enter="handleCreateFolder"
                />
            </div>
        </div>
        
        <template #footer>
            <Button 
                label="Hủy" 
                icon="pi pi-times" 
                text 
                @click="createFolderVisible = false"
            />
            <Button 
                label="Tạo" 
                icon="pi pi-check" 
                :disabled="!newFolderName.trim()"
                @click="handleCreateFolder" 
            />
        </template>
    </Dialog>
</template>