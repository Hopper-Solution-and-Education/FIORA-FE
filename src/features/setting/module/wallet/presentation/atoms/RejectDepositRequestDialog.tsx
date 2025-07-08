import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface RejectDepositRequestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
}

const RejectDepositRequestDialog = ({
  open,
  onClose,
  onConfirm,
}: RejectDepositRequestModalProps) => {
  const [remark, setRemark] = useState('');
  const [touched, setTouched] = useState(false);

  const handleConfirm = () => {
    setTouched(true);
    if (remark.trim()) {
      onConfirm(remark.trim());
      setRemark('');
      setTouched(false);
    }
  };

  const handleClose = () => {
    setRemark('');
    setTouched(false);
    onClose();
  };

  const isError = touched && !remark.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg w-full rounded-2xl bg-white shadow-lg p-10"
        style={{ minWidth: 360 }}
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 mt-2">
            <Icons.info className="text-blue-500" style={{ fontSize: 36, width: 36, height: 36 }} />
          </div>
          <DialogHeader className="w-full">
            <DialogTitle
              className="text-2xl font-bold w-full text-center text-[#1A202C]"
              style={{ lineHeight: '32px' }}
            >
              Reject Deposit Request
            </DialogTitle>
            <DialogDescription
              className="w-full mt-2 text-base text-[#667085] text-center"
              style={{ lineHeight: '24px' }}
            >
              Are you sure you want to reject this deposit request?
              <br />
              This action cannot be undone and will notify the user
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="w-full mt-8">
          <label
            className="font-medium text-base mb-2 block text-left text-[#344054]"
            style={{ marginBottom: 6 }}
          >
            Provide a Reason <span className="text-[#F04438]">*</span>
          </label>
          <Textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Type your message here"
            rows={5}
            className={
              'rounded-lg min-h-[120px] text-base px-4 py-4 border-[1.5px] border-[#D0D5DD] focus:outline-none focus:border-blue-500 shadow-sm placeholder:text-[#98A2B3]' +
              (isError ? ' border-[#F04438]' : '')
            }
            style={{ resize: 'none', fontSize: 16, padding: 16 }}
            autoFocus
          />
          {isError && (
            <div className="text-xs text-[#F04438] mt-1" style={{ marginTop: 4 }}>
              Reason is required
            </div>
          )}
        </div>
        <div className="mt-6 text-xs text-[#667085] w-full flex flex-col items-center gap-1">
          <div className="flex items-center justify-center">
            Click
            <span className="mx-1 text-blue-600 font-normal">←</span>
            <span className="font-semibold">to stay back</span>
          </div>
          <div className="flex items-center justify-center">
            Or click
            <span className="mx-1 text-green-600 font-normal">✓</span>
            <span className="font-semibold">to confirm</span>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-4 justify-center mt-8 w-full">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            className="flex-1 h-12 w-full rounded-lg border-[1.5px] border-[#D0D5DD] bg-white text-[#344054] text-base font-medium flex items-center justify-center transition-all duration-200 hover:shadow-md hover:border-blue-500 hover:bg-[#F3F6FA] active:border-blue-700 focus:outline-none"
            style={{ boxShadow: 'none' }}
          >
            <Icons.arrowLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!remark.trim()}
            type="button"
            className="flex-1 h-12 w-full rounded-lg text-base font-medium bg-[#1976D2] text-white border-0 flex items-center justify-center transition-all duration-200 hover:shadow-md hover:bg-[#1565C0] active:bg-[#0D47A1] disabled:opacity-60 focus:outline-none"
            style={{ boxShadow: 'none' }}
          >
            <Icons.check className="w-6 h-6" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDepositRequestDialog;
