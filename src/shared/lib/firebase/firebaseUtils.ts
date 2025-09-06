import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'sonner';
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
    if (!isFirebaseUrlOfProject(fileUrl)) {
      console.warn('Ignored non-Firebase or wrong project URL:', fileUrl);
      return;
    }

    // Tách path từ downloadURL
    const getPathFromDownloadURL = (url: string): string | null => {
      try {
        const u = new URL(url);
        const match = u.pathname.match(/\/o\/([^?]+)/); // lấy phần sau /o/
        return match ? decodeURIComponent(match[1]) : null;
      } catch {
        return null;
      }
    };

    const path = getPathFromDownloadURL(fileUrl);
    if (!path) {
      console.warn('Invalid Firebase URL format:', fileUrl);
      return;
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.error('Error removing from Firebase:', error);
    toast.error('Error removing from Firebase', {
      description: error.message,
    });
  }
};

const isFirebaseUrlOfProject = (url: string): boolean => {
  try {
    const u = new URL(url);
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Kiểm tra trong path có chứa bucket/projectId không
    // Thường nằm sau `/v0/b/`
    if (u.hostname === 'firebasestorage.googleapis.com') {
      return u.pathname.includes(projectId!);
    }

    // Ngoài ra check các domain kiểu *.appspot.com hoặc *.firebasestorage.app
    if (u.hostname.includes(projectId!)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
