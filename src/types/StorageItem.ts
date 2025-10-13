export type ItemType = 'folder' | 'image' | 'document' | 'video' | 'other';

export interface StorageItem {
    id: string;
    name: string;
    type: ItemType;
    size: number; // Kích thước tính bằng byte (0 nếu là folder/album)
    uploadedDate: string;
    isFavorite: boolean;
    isDeleted: boolean; // Dùng cho Trash
    isAlbum: boolean;   // TRUE nếu là Album/Folder
    isPublic: boolean;  // Dùng cho Public/Private Album
    uri: string;
}