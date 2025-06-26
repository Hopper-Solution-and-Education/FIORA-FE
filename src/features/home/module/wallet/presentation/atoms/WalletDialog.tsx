import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Icons } from '@/components/Icon';

interface WalletDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const WalletDialog = ({ open, onCancel, onConfirm }: WalletDialogProps) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="max-w-md">
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <Icons.warning className="text-yellow-400 w-12 h-12 mb-2" />
        <DialogTitle className="text-xl font-bold text-center w-full">
          Leaving This Page
        </DialogTitle>
        <DialogDescription className="text-base text-center w-full">
          {"It looks like you haven't submitted the request"}
          <br />
          {"All information you've entered will be lost if you proceed"}
        </DialogDescription>
        <div className="mt-4 text-center text-base">
          <span>
            Click{' '}
            <span className="inline-flex align-middle text-blue-500">
              <ArrowLeftIcon className="inline w-5 h-5" />
            </span>{' '}
            to stay back
          </span>
          <br />
          <span>
            Or click{' '}
            <span className="inline-flex align-middle text-green-500">
              <Icons.check className="inline w-5 h-5" />
            </span>{' '}
            to confirm
          </span>
        </div>
      </div>
      <DialogFooter className="flex flex-row gap-4 justify-between mt-4">
        <Button variant="outline" onClick={onCancel} className="w-40" size="lg">
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <Button
          onClick={onConfirm}
          className="w-40 bg-yellow-400 hover:bg-yellow-500 text-white text-lg font-semibold flex items-center justify-center"
          size="lg"
        >
          <Icons.check className="text-green-500 stroke-[2] !h-[24px] !w-[24px]" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default WalletDialog;
