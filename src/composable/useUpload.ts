// src/composables/useUploader.ts
import type { FileUploadUploaderEvent } from 'primevue/fileupload';

/**
 * Hàm xử lý tải lên (upload) file ảnh.
 * @param event Đối tượng sự kiện từ PrimeVue FileUpload @uploader.
 */
export function useUploader() {
    
    const customUpload = async (event: FileUploadUploaderEvent) => {
        // PrimeVue dùng FileUploadUploaderEvent, nhưng nếu dùng interface tự định nghĩa 
        // ở trên thì bạn giữ nguyên: (event: { files: File[] })
        const files: File[] = event.files;
        const formData = new FormData();
        
        // Thêm các file vào FormData
        for (const file of files) {
            // Đảm bảo tên field 'image' này khớp với yêu cầu của API Backend
            formData.append('image', file, file.name); 
        }

        console.log(`Đang tải lên ${files.length} file...`);

        // Gọi API để tải ảnh lên
        try {
            const response = await fetch(`http://192.168.1.113:8085/api/photos/create_photo?userId&name&file`, {
                method: 'POST',
                body: formData,
                // Thêm Authorization token nếu cần:
                // headers: { 'Authorization': `Bearer ${yourAuthToken}` }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload thành công!', result);
                // TODO: Xử lý sau khi upload (ví dụ: hiển thị thông báo thành công)
                return true;
            } else {
                console.error('Upload thất bại. Trạng thái:', response.status);
                // TODO: Xử lý lỗi từ server
                return false;
            }
        } catch (error) {
            console.error('Lỗi kết nối khi upload:', error);
            // TODO: Xử lý lỗi mạng
            return false;
        }
    };
    
    return {
        customUpload
    };
}