import { useState } from 'react';
import { toast } from 'sonner';

export function useDeletePackageFx() {
  const [loading, setLoading] = useState(false);

  const deletePackageFx = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/package?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Delete failed');
      }
      toast.success('Deleted package successfully!');
      return true;
    } catch (err: any) {
      if (err?.message?.includes('active deposit requests')) {
        toast.error('Cannot delete: There are active deposit requests');
      } else if (err?.message?.includes('not found')) {
        toast.error('Package not found');
      } else {
        toast.error(err?.message || 'Delete failed');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePackageFx, loading };
}
