// src/services/ItemService.ts

import { fileData } from '../graphql/FakeData';
import type { StorageItem } from '../types/StorageItem'; // Import kiểu dữ liệu

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @description Lấy tất cả các mục (Album/File) đã được hợp nhất từ nguồn.
 */
export const fetchAllItems = async (): Promise<StorageItem[]> => {
    await delay(100);
    // Ép kiểu dữ liệu để đảm bảo khớp với StorageItem[]
    return fileData.data.getUserItems as StorageItem[]; 
};

/**
 * @description Giả lập việc thay đổi trạng thái yêu thích
 */
export const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
    await delay(50);
    console.log(`[API MOCK] Cập nhật yêu thích cho ID ${itemId} thành ${isFavorite}`);
    return { success: true, itemId, isFavorite };
};

/**
 * @description Giả lập việc di chuyển mục vào Thùng rác
 */
export const moveToTrash = async (itemId: string) => {
    await delay(50);
    console.log(`[API MOCK] Chuyển ID ${itemId} vào Thùng rác`);
    return { success: true, itemId };
};

/**
 * @description Giả lập việc tải lên một tệp tin mới và trả về StorageItem.
 */
export const uploadNewItem = async (file: File): Promise<StorageItem> => {
    await delay(150);
    
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    let itemType: StorageItem['type'] = 'document';
    if (file.type.startsWith('image/')) {
        itemType = 'image';
    } else if (file.type.startsWith('video/')) {
        itemType = 'video';
    }

    const newItem: StorageItem = {
        id: newId,
        name: file.name,
        type: itemType,
        size: file.size,
        uploadedDate: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
        isFavorite: false,
        isDeleted: false,
        isAlbum: false,
        isPublic: false,
        uri: itemType === 'image' ? 'https://via.placeholder.com/300' : '' 
    };
    
    return newItem;

    
};
export const createNewAlbum = async (albumName: string): Promise<StorageItem> => {
    await delay(100); 

    const newId = 'album-' + Date.now().toString(36);

    const newAlbum: StorageItem = {
        id: newId,
        name: albumName,
        type: 'folder', // Loại là folder/album
        size: 0, 
        uploadedDate: new Date().toISOString().split('T')[0]?? new Date().toISOString(),
        isFavorite: false,
        isDeleted: false,
        isAlbum: true, // Đánh dấu là album
        isPublic: false, // Mặc định là riêng tư
        uri: ''
    };

    // Thêm mục mới vào LocalStorage
    const currentItems = getItemsFromCache() || [];
    currentItems.unshift(newAlbum);
    saveItemsToCache(currentItems);

    return newAlbum;
};

/**
 * @description Lấy danh sách các mục từ LocalStorage cache.
 */
function getItemsFromCache(): StorageItem[] | null {
    const items = localStorage.getItem('storageItems');
    return items ? JSON.parse(items) as StorageItem[] : null;
}

/**
 * @description Lưu danh sách các mục vào LocalStorage cache.
 */
function saveItemsToCache(items: StorageItem[]): void {
    localStorage.setItem('storageItems', JSON.stringify(items));
}