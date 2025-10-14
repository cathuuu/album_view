// src/services/ItemService.ts
import type { StorageItem } from '../types/StorageItem';

const API_BASE = '/api/v1/media';

export const fetchAllItems = async (): Promise<StorageItem[]> => {
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) throw new Error('Lỗi khi tải danh sách media');
    return await res.json();
};

export const uploadNewItem = async (file: File): Promise<StorageItem | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", "68ea31f9b545a702d865f1d2"); // 👈 dùng id_user từ cookie nếu có

  const response = await fetch("/api/v1/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    console.error("❌ Upload failed:", response.status, response.statusText);
    return null;
  }

  // đọc 1 lần duy nhất
  const text = await response.text();
  console.log("📦 Raw response text:", text);

  try {
    const result = JSON.parse(text);
    console.log("✅ Parsed JSON:", result);

    // backend trả về trực tiếp object media -> không có .data hoặc .success
    return result as StorageItem;
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    return null;
  }
};
export const createNewAlbum = async (name: string, isPrivate: boolean): Promise<StorageItem> => {
    const res = await fetch(`${API_BASE}/album?name=${encodeURIComponent(name)}`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Không thể tạo album');
    return await res.json();
};

export const moveToTrash = async (itemId: string) => {
    const res = await fetch(`${API_BASE}/trash/${itemId}`, {
        method: 'PATCH',
    });
    return await res.json();
};

export const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
    const res = await fetch(`${API_BASE}/favorite/${itemId}?favorite=${isFavorite}`, {
        method: 'PATCH',
    });
    return await res.json();
};
