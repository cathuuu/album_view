// src/services/ItemService.ts

import { fileData } from '../graphql/FakeData';
import type { StorageItem } from '../types/StorageItem';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @description Lấy tất cả các mục (Album/File) đã được hợp nhất từ nguồn.
 */
export const fetchAllItems = async (): Promise<StorageItem[]> => {
    await delay(100);
    const baseItems = (fileData.data.getUserItems || []) as StorageItem[];
    const cachedItems = getItemsFromCache() || [];

    // Merge by id, cached overrides base
    const idToItem = new Map<string, StorageItem>();
    for (const item of baseItems) idToItem.set(item.id, item);
    for (const item of cachedItems) idToItem.set(item.id, item);
    return Array.from(idToItem.values());
};

/**
 * @description Giả lập việc thay đổi trạng thái yêu thích
 */
export const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
    await delay(50);

    const cachedItems = getItemsFromCache() || [];
    const existingIndex = cachedItems.findIndex((it) => it.id === itemId);
    if (existingIndex >= 0) {
        cachedItems[existingIndex] = { ...cachedItems[existingIndex], isFavorite };
    } else {
        const baseItems = (fileData.data.getUserItems || []) as StorageItem[];
        const original = baseItems.find((it) => it.id === itemId);
        if (original) {
            cachedItems.unshift({ ...original, isFavorite });
        }
    }
    saveItemsToCache(cachedItems);

    return { success: true, itemId, isFavorite };
};

/**
 * @description Giả lập việc di chuyển mục vào Thùng rác
 */
export const moveToTrash = async (itemId: string) => {
    await delay(50);

    const cachedItems = getItemsFromCache() || [];
    const existingIndex = cachedItems.findIndex((it) => it.id === itemId);
    if (existingIndex >= 0) {
        cachedItems[existingIndex] = { ...cachedItems[existingIndex], isDeleted: true };
    } else {
        const baseItems = (fileData.data.getUserItems || []) as StorageItem[];
        const original = baseItems.find((it) => it.id === itemId);
        if (original) {
            cachedItems.unshift({ ...original, isDeleted: true });
        }
    }
    saveItemsToCache(cachedItems);

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
    // persist to cache
    const currentItems = getItemsFromCache() || [];
    currentItems.unshift(newItem);
    saveItemsToCache(currentItems);

    return newItem;
};
export const createNewAlbum = async (albumName: string, isPublic: boolean = false): Promise<StorageItem> => {
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
        isPublic, // true cho public, false cho private
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