<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import ContextMenu from 'primevue/contextmenu';
import { ref } from 'vue';
import type { StorageItem } from '../types/StorageItem'; 
import { getItemIcon, formatSize } from '../utils/itemUtils'; 

const props = defineProps<{
    // Đặt item là tùy chọn (optional) trong trường hợp bị null/undefined
    item: StorageItem | undefined | null; 
    layout: 'list' | 'grid';
}>();

const emit = defineEmits(['item-click', 'favorite-toggle', 'delete-item']); 

const cm = ref();

// --- LOGIC CONTEXT MENU ---
// Thêm kiểm tra an toàn: chỉ tạo menu items nếu item tồn tại
const getMenuItems = (item: StorageItem | undefined | null) => {
    // 🛑 KIỂM TRA AN TOÀN TRƯỚC KHI TRUY CẬP THUỘC TÍNH
    if (!item) return []; 

    return ([
        // 1. Thao tác Yêu thích
        {
            label: item.isFavorite ? 'Bỏ Yêu thích' : 'Thêm vào Yêu thích',
            icon: item.isFavorite ? 'pi pi-heart-slash' : 'pi pi-heart-fill',
            command: () => { 
                emit('favorite-toggle', item.id, !item.isFavorite); 
            }
        },
        { separator: true },
        // 2. Các thao tác khác
        { label: 'Đổi tên', icon: 'pi pi-pencil', command: () => { alert(`Đổi tên: ${item.name}`) } },
        { label: 'Tải xuống', icon: 'pi pi-download', command: () => window.open(item.uri, '_blank') },
        { separator: true },
        // 3. Xóa
        {
            label: 'Di chuyển vào Thùng rác',
            icon: 'pi pi-trash',
            class: 'text-red-600',
            command: () => { 
                emit('delete-item', item.id);
            }
        }
    ]);
};

// ... (các hàm onContextMenu và onItemClick giữ nguyên)
// ...

const onContextMenu = (event: MouseEvent) => {
    // Thêm kiểm tra an toàn cho onContextMenu
    if (!props.item) return; 
    
    event.preventDefault();
    cm.value.show(event);
};

const onItemClick = (item: StorageItem | undefined | null) => {
    if (item) {
        emit('item-click', item);
    }
};
</script>

<template>
    <ContextMenu v-if="props.item" ref="cm" :model="getMenuItems(props.item)" /> 

    <div v-if="!props.item"></div> 
    
    <div v-else-if="layout === 'list'" 
        class="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        @click="onItemClick(item)"
        @contextmenu="onContextMenu" 
    >
        <div class="w-1/12"><i :class="[getItemIcon(item!.type, item!.isAlbum), 'text-xl']"></i></div>
        <div class="w-4/12 font-medium truncate" :title="item!.name">{{ item!.name }}</div>
        <div class="w-2/12 text-sm text-gray-500">{{ formatSize(item!.size) }}</div>
        <div class="w-4/12 text-sm text-gray-500">{{ item!.uploadedDate }}</div>
        <div class="w-1/12 text-right">
            <i v-if="item!.isFavorite" class="pi pi-heart-fill text-red-500"></i>
        </div>
    </div>

    <div v-else class="col-12 sm:col-6 md:col-4 lg:col-3 p-3">
        <Card 
            class="shadow-sm h-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="onItemClick(item)"
            @contextmenu="onContextMenu"
        >
            <template #content>
                <div class="flex flex-col items-center text-center">
                    <div class="text-6xl mb-3"><i :class="[getItemIcon(item!.type, item!.isAlbum)]"></i></div>
                    <div class="font-bold text-base mb-1 h-10 overflow-hidden" :title="item!.name">
                        {{ item!.name }}
                    </div>
                    <Tag :value="formatSize(item!.size)" severity="info" class="mt-2" />
                </div>
            </template>
        </Card>
    </div>
</template>