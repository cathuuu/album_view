// src/services/ItemService.ts
import axios from "axios";
import type { StorageItem } from "../types/StorageItem";

const BASE_URL = "http://localhost:8080/api/v1/media";
const FIXED_USER_ID = "68ea31f9b545a702d865f1d2"; // 👈 tạm thời để cứng

// 🧩 Lấy danh sách media của user
export const fetchUserMedia = async (userId: string = FIXED_USER_ID): Promise<StorageItem[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/${userId}`);
    console.log("📸 Media fetched:", res.data);
    return res.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách media:", error);
    return [];
  }
};

// 🧩 Lấy tất cả media (nếu cần)
export const fetchAllItems = async (): Promise<StorageItem[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/all`);
    return res.data || [];
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách media:", err);
    throw err;
  }
};

// 🧩 Upload file
export const uploadNewItem = async (file: File): Promise<StorageItem | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", FIXED_USER_ID);

  try {
    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Upload response:", res.data);
    return res.data as StorageItem;
  } catch (error: any) {
    console.error("❌ Upload failed:", error.response?.data || error.message);
    return null;
  }
};

// 🧩 Tạo album mới
export const createNewAlbum = async (name: string, isPrivate: boolean): Promise<StorageItem> => {
  try {
    const res = await axios.post(`${BASE_URL}/album`, null, {
      params: { name, private: isPrivate },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Không thể tạo album:", err);
    throw err;
  }
};

// 🧩 Chuyển vào thùng rác
export const moveToTrash = async (itemId: string) => {
  try {
    const res = await axios.patch(`${BASE_URL}/trash/${itemId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi xoá tệp:", err);
    throw err;
  }
};

// 🧩 Đánh dấu yêu thích / bỏ yêu thích
export const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
  try {
    const res = await axios.patch(`${BASE_URL}/favorite/${itemId}`, null, {
      params: { favorite: isFavorite },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi toggle favorite:", err);
    throw err;
  }
};
