// ===================== ITEM TYPE =====================
export type ItemType = 'folder' | 'media';

// ===================== STORAGE ITEM (UNION) =====================
export interface StorageItem {
  id: string;
  name: string;
  type: ItemType;
  isDeleted: boolean;
  isShared?: boolean;
  coverUrl?: string;
  size?: number;
  path?: string;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  photoMeta?: {
    width?: number;
    height?: number;
    cameraModel?: string;
    iso?: number;
    aperture?: string;
  };
  videoMeta?: {
    duration?: number;
    resolution?: string;
    frameRate?: number;
  };
}

// ===================== USER =====================
export interface UserDocument {
  id: string;
  username: string;
  password: string;
  fullName?: string;
  gender?: string;
  dob?: string; // ISO string
  roleIds?: string[];
  email?: string;
  phone?: string;
  statusUser?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ===================== FOLDER =====================
export interface FolderDocument {
  id: string;
  ownerId: UserDocument; // ✅ KHÔNG phải String — đúng theo GraphQL type
  name: string;
  parentId?: string | null;
  coverUrl?: string | null;
  isShared?: boolean;
  path: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ===================== MEDIA =====================
export interface MediaDocument {
  id: string;
  owner: UserDocument;
  folder?: FolderDocument | null;
  type?: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  photoMeta?: PhotoMeta;
  videoMeta?: VideoMeta;
  likeCount?: number;
}

export interface PhotoMeta {
  cameraModel?: string;
  iso?: number;
  aperture?: string;
}

export interface VideoMeta {
  duration?: number;
  resolution?: string;
  frameRate?: number;
}

// ===================== FOLDER SHARE =====================
export interface FolderShareDocument {
  id: string;
  folder: FolderDocument;
  sharedWith: UserDocument;
  sharedBy: UserDocument;
  permission: string[]; // ["VIEW", "EDIT", ...]
  createdAt?: string;
  updatedAt?: string;
}

// ===================== MEDIA SHARE =====================
export interface MediaShareDocument {
  id: string;
  media: MediaDocument;
  sharedWith: UserDocument;
  sharedBy: UserDocument;
  permission: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ===================== MEDIA LIKE =====================
export interface MediaLikeDocument {
  id: string;
  media: MediaDocument;
  user: UserDocument;
  createdAt?: string;
}
