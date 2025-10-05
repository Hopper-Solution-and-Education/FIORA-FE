import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import attachmentServices from '@/shared/services/attachment';
import { toast } from 'sonner';

interface UploadAttachmentOptions {
  file: File;
  basePath: string; // Base path in Firebase Storage (e.g., 'attachments/wallet')
  fileName?: string; // Optional custom file name
}

// Reusable function to upload file to Firebase and insert attachment into database
export const createAttachment = async ({
  file,
  basePath,
  fileName,
}: UploadAttachmentOptions): Promise<any> => {
  try {
    // Step 1: Upload to Firebase and get URL
    const finalFileName = fileName ? `${fileName}_${Date.now()}` : `${Date.now()}`;
    const extension = (file.type.split('/')[1] || 'file').toLowerCase();
    const storagePath = `${basePath}/${finalFileName}.${extension}`;

    const url = await uploadToFirebase({
      file,
      path: basePath,
      fileName: finalFileName,
    });

    // Step 2: Call service to insert into database
    const response = await attachmentServices.createAttachment({
      url,
      path: storagePath,
      type: file.type,
      size: file.size,
    });

    toast.success('Attachment created successfully');
    return response.data;
  } catch (error: any) {
    toast.error('Failed to create attachment', {
      description: error?.message,
    });
    throw error;
  }
};
