import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDepositProofUrl } from '../../slices';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_SIZE_MB = 5;

const WalletUploadProof: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type.');
      setFileName(null);
      dispatch(setDepositProofUrl(null));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('File too large (max 5MB).');
      setFileName(null);
      dispatch(setDepositProofUrl(null));
      return;
    }
    setFileName(file.name);
    setError(null);
    setUploading(true);
    try {
      const url = await uploadToFirebase({
        file,
        path: 'wallet/deposit-proof',
        fileName: file.name.replace(/\.[^/.]+$/, ''),
      });
      dispatch(setDepositProofUrl(url));
    } catch (err) {
      console.error(err);
      setError('Upload failed');
      dispatch(setDepositProofUrl(null));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Button
        variant="outline"
        className="btn btn-primary w-full"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        Upload Payment Proof
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {fileName && <div className="text-xs text-muted-foreground">Selected: {fileName}</div>}
      {error && <div className="text-xs text-destructive">{error}</div>}
      {uploading && <div className="text-xs text-muted-foreground">Uploading...</div>}
    </div>
  );
};

export default WalletUploadProof;
