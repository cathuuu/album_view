// src/utils/itemUtils.ts

import type { ItemType } from '../types/StorageItem';

/**
 * @description Trả về CSS class (PrimeIcons) tương ứng với loại mục lưu trữ.
 * @param {ItemType} type Loại mục (image, document, etc.)
 * @param {boolean} isAlbum True nếu mục đó là Album/Folder.
 * @returns {string} Chuỗi CSS class của PrimeIcon.
 */
export const getItemIcon = (type: ItemType, isAlbum: boolean): string => {
    if (isAlbum) {
        return 'pi pi-folder-open text-yellow-500';
    }
    switch (type) {
        case 'image': return 'pi pi-image text-blue-500';
        case 'document': return 'pi pi-file-pdf text-red-500';
        case 'video': return 'pi pi-video text-green-500';
        default: return 'pi pi-file text-gray-500';
    }
};

/**
 * @description Định dạng kích thước tệp tin (B, KB, MB, GB).
 */
export const formatSize = (bytes: number): string => { 
    if (bytes === 0) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};