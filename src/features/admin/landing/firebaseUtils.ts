import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase.config';

// Interface cho options của upload
interface UploadOptions {
  file: File | Blob; // File hoặc Blob để upload
  path: string; // Đường dẫn trong Firebase Storage (ví dụ: 'images/media/banner_123')
  fileName?: string; // Tên file tùy chỉnh (nếu không cung cấp, dùng timestamp)
}

export const uploadToFirebase = async ({
  file,
  path,
  fileName,
}: UploadOptions): Promise<string> => {
  try {
    // Tạo tên file duy nhất nếu không được cung cấp
    const finalFileName = fileName ? `${fileName}_${Date.now()}` : `${Date.now()}`;
    const extension = (file.type.split('/')[1] || 'file').toLowerCase(); // Lấy extension từ MIME type
    const storagePath = `${path}/${finalFileName}.${extension}`;
    const storageRef = ref(storage, storagePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Lấy URL tải xuống
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    throw error;
  }
};

export const removeFromFirebase = async (fileUrl: string): Promise<void> => {
  try {
    // Tạo reference từ URL
    const storageRef = ref(storage, fileUrl);

    // Xóa file
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error removing from Firebase:', error);
    throw error;
  }
};
