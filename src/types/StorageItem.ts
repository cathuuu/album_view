export type ItemType = 'folder' | 'image' | 'document' | 'video' | 'other';

export interface StorageItem {
    id: string;
    type: string; // 'photo', 'video', 'folder'
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    isDeleted: boolean;
    isFavorite?: boolean;
    createdAt: string;
    updatedAt: string;
    photoMeta?: {
        cameraModel?: string;
        iso?: number;
        aperture?: string;
    };
    videoMeta?: any;
}
