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

    // Gộp hai nguồn dữ liệu (cache ghi đè base)
    const idToItem = new Map<string, StorageItem>();
    for (const item of baseItems) idToItem.set(item.id, item);
    for (const item of cachedItems) idToItem.set(item.id, item);

    const mergedItems = Array.from(idToItem.values());

    // Lưu lại snapshot để tồn tại sau reload
    saveItemsToCache(mergedItems);

    return mergedItems;
};

/**
 * @description Giả lập việc thay đổi trạng thái yêu thích (Favorite)
 */
export const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
    await delay(50);

    const cachedItems = getItemsFromCache() || [];
    const existingIndex = cachedItems.findIndex(it => it.id === itemId);

    if (existingIndex >= 0 && cachedItems[existingIndex]) {
        const existingItem = cachedItems[existingIndex];
        cachedItems[existingIndex] = {
            ...existingItem,
            id: existingItem?.id ?? '',
            name: existingItem?.name ?? '',
            type: existingItem?.type ?? 'document',
            size: existingItem?.size ?? 0,
            uploadedDate: existingItem?.uploadedDate ?? '',
            isFavorite,
            isDeleted: existingItem?.isDeleted ?? false,
            isAlbum: existingItem?.isAlbum ?? false,
            isPublic: existingItem?.isPublic ?? false,
            uri: existingItem?.uri ?? '',
            parentId: existingItem?.parentId ?? null
        };
    } else {
        const baseItems = (fileData.data.getUserItems || []) as StorageItem[];
        const original = baseItems.find(it => it.id === itemId);
        if (original) cachedItems.unshift({ ...original, isFavorite });
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
    const existingIndex = cachedItems.findIndex(it => it.id === itemId);

    if (existingIndex >= 0) {
        cachedItems[existingIndex] = {
            ...cachedItems[existingIndex],
            id: cachedItems[existingIndex]?.id ?? '',
            name: cachedItems[existingIndex]?.name ?? '',
            type: cachedItems[existingIndex]?.type ?? 'document',
            size: cachedItems[existingIndex]?.size ?? 0,
            uploadedDate: cachedItems[existingIndex]?.uploadedDate ?? '',
            isFavorite: cachedItems[existingIndex]?.isFavorite ?? false,
            isDeleted: true,
            isAlbum: cachedItems[existingIndex]?.isAlbum ?? false,
            isPublic: cachedItems[existingIndex]?.isPublic ?? false,
            uri: cachedItems[existingIndex]?.uri ?? '',
            parentId: cachedItems[existingIndex]?.parentId ?? null
        };
    } else {
        const baseItems = (fileData.data.getUserItems || []) as StorageItem[];
        const original = baseItems.find(it => it.id === itemId);
        if (original) cachedItems.unshift({ ...original, isDeleted: true });
    }

    saveItemsToCache(cachedItems);
    return { success: true, itemId };
};

/**
 * @description Giả lập việc khôi phục mục khỏi Thùng rác
 */
export const restoreFromTrash = async (itemId: string) => {
    await delay(50);

    const cachedItems = getItemsFromCache() || [];
    const index = cachedItems.findIndex(it => it.id === itemId);

    if (index >= 0) {
        const existingItem = cachedItems[index];
        cachedItems[index] = {
            id: existingItem?.id ?? '',
            name: existingItem?.name ?? '',
            type: existingItem?.type ?? 'document',
            size: existingItem?.size ?? 0,
            uploadedDate: existingItem?.uploadedDate ?? '',
            isFavorite: existingItem?.isFavorite ?? false,
            isDeleted: false,
            isAlbum: existingItem?.isAlbum ?? false,
            isPublic: existingItem?.isPublic ?? false,
            uri: existingItem?.uri ?? '',
            parentId: existingItem?.parentId ?? null
        };
    }

    saveItemsToCache(cachedItems);
    return { success: true, itemId };
};

/**
 * @description Giả lập việc tải lên một tệp tin mới (có thể trong thư mục con)
 */
export const uploadNewItem = async (file: File, parentId: string | null = null): Promise<StorageItem> => {
    await delay(150);

    const newId = 'file-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    let itemType: StorageItem['type'] = 'document';

    if (file.type.startsWith('image/')) itemType = 'image';
    else if (file.type.startsWith('video/')) itemType = 'video';

    const newItem: StorageItem = {
        id: newId,
        name: file.name,
        type: itemType,
        size: file.size,
        uploadedDate: new Date().toISOString().split('T')[0] ?? '',
        isFavorite: false,
        isDeleted: false,
        isAlbum: false,
        isPublic: false,
        uri: itemType === 'image' ? 'https://via.placeholder.com/300' : '',
        parentId // ✅ lưu thư mục cha
    };

    const currentItems = getItemsFromCache() || [];
    currentItems.unshift(newItem);
    saveItemsToCache(currentItems);

    return newItem;
};

/**
 * @description Tạo một Album hoặc Folder mới (có thể nằm trong thư mục khác)
 */
export const createNewAlbum = async (
    albumName: string,
    isPublic: boolean = false,
    parentId: string | null = null
): Promise<StorageItem> => {
    await delay(100);

    const newId = 'album-' + Date.now().toString(36);

    const newAlbum: StorageItem = {
        id: newId,
        name: albumName,
        type: 'folder',
        size: 0,
        uploadedDate: new Date().toISOString().split('T')[0],
        isFavorite: false,
        isDeleted: false,
        isAlbum: true,
        isPublic,
        uri: '',
        parentId // ✅ thư mục cha (nếu có)
    };

    const currentItems = getItemsFromCache() || [];
    currentItems.unshift(newAlbum);
    saveItemsToCache(currentItems);

    return newAlbum;
};

/**
 * @description Lấy danh sách các mục trong một thư mục cụ thể (theo parentId)
 */
export const fetchItemsInFolder = async (parentId: string | null): Promise<StorageItem[]> => {
    const all = await fetchAllItems();
    return all.filter(it => it.parentId === parentId && !it.isDeleted);
};

/**
 * @description Lấy danh sách các mục từ LocalStorage cache
 */
function getItemsFromCache(): StorageItem[] | null {
    const items = localStorage.getItem('storageItems');
    return items ? (JSON.parse(items) as StorageItem[]) : null;
}

/**
 * @description Lưu danh sách các mục vào LocalStorage cache
 */
function saveItemsToCache(items: StorageItem[]): void {
    localStorage.setItem('storageItems', JSON.stringify(items));
}
