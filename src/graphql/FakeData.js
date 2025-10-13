// src/graphql/FakeData.js

const photoData = {
    "data": {
        "getUserPhotos": [
            {
                "id": "1",
                "url": "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg",
                "filename": "img1",
                "liked": true, // <= Cần chuyển đổi
                "createdAt": "2025-09-28T11:42:40.806042Z",
                "isDeleted": false
            },
            {
                "id": "2", "url": null, "filename": "img 2", "liked": false,
                "createdAt": "2025-09-28T13:51:18.264598Z", "isDeleted": false
            },
            {
                "id": "3", "url": null, "filename": "tệp trống", "liked": false,
                "createdAt": "2025-09-28T15:17:52.681029Z", "isDeleted": false
            },
            {
                "id": "4", "url": "...", "filename": "user 1", "liked": false,
                "createdAt": "2025-09-28T15:17:59.104424Z", "isDeleted": false
            },
             {
                "id": "6", "url": "...", "filename": "Tệp bị xóa", "liked": false,
                "createdAt": "2025-09-28T15:28:05.236354Z", "isDeleted": true // Giả định tệp này đã bị xóa
            }
        ]
    }
};

const DataAlbumUser = {
    "data": {
        "getUserAlbums": [
            {
                "id": "a1", // Thay đổi ID để tránh trùng lặp với ảnh
                "name": "album1 (Public)",
                "createdAt": "1999-12-31T17:00Z",
                "photos": [{ "id": "1", "filename": "img1" }], // Giữ ID ảnh cũ
                "isPublic": true // Thêm thuộc tính phân loại Album
            },
            {
                "id": "a2",
                "name": "Album Riêng Tư",
                "createdAt": "2025-09-28T11:42:40.806042Z",
                "photos": [],
                "isPublic": false
            }
        ]
    }
};

// --- HÀM HỢP NHẤT VÀ CHUYỂN ĐỔI DỮ LIỆU ---

// 1. Chuyển đổi Album thành StorageItem (isAlbum: true)
const albumsAsItems = DataAlbumUser.data.getUserAlbums.map(album => ({
    id: album.id,
    name: album.name,
    type: 'folder',
    size: 0,
    uploadedDate: album.createdAt.split('T')[0],
    isFavorite: false, // Giả định album không có trạng thái favorite
    isDeleted: false,
    isAlbum: true,
    isPublic: album.isPublic,
    uri: ''
}));

// 2. Chuyển đổi Ảnh/Tệp thành StorageItem (isAlbum: false)
const photosAsItems = photoData.data.getUserPhotos.map(photo => ({
    id: photo.id,
    name: photo.filename || `Tệp không tên (${photo.id})`,
    type: photo.url ? 'image' : 'document', // Giả định có URL là ảnh, không có là document
    size: photo.url ? 4000000 : 1000000, // Kích thước giả định
    uploadedDate: photo.createdAt.split('T')[0],
    isFavorite: photo.liked, // Chuyển đổi 'liked' thành 'isFavorite'
    isDeleted: photo.isDeleted,
    isAlbum: false,
    isPublic: false, // Giả định ảnh đơn lẻ là private/non-public
    uri: photo.url || ''
}));

// 3. Hợp nhất Albums và Photos thành một mảng duy nhất và loại bỏ các ảnh đã có trong album (để tránh trùng lặp)
// *Lưu ý: Logic này đơn giản hóa, chỉ hiển thị Album và các Tệp không thuộc Album.*
const albumPhotoIds = DataAlbumUser.data.getUserAlbums.flatMap(a => a.photos.map(p => p.id));
const nonAlbumPhotos = photosAsItems.filter(p => !albumPhotoIds.includes(p.id));


const allItems = [
    ...albumsAsItems,
    ...nonAlbumPhotos
];

// --- EXPORT CUỐI CÙNG ---

export const fileData = { // <-- EXPORT CẦN THIẾT CHO CÁC VIEW
    data: {
        getUserItems: allItems
    }
};

// Bạn có thể giữ lại userList nếu cần
export const userList = {
    // ... (dữ liệu users)
};