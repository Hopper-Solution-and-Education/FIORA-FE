import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface RejectDepositRequestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
  isUpdating: boolean;
  requestType?: 'Deposit' | 'Withdraw';
}

const RejectDepositRequestDialog = ({
  open,
  onClose,
  onConfirm,
  isUpdating,
  requestType = 'Deposit',
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
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-muted shadow-lg">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Icons.info className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          </div>

          <div className="text-center space-y-3 w-full">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Reject {requestType} Request
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to reject this {requestType.toLowerCase()} request?
              <br />
              This action cannot be undone and will notify the user
            </DialogDescription>
          </div>

          <div className="w-full mt-2 text-left">
            <label className="font-medium text-base mb-2 block text-foreground">
              Provide a Reason <span className="text-[#F04438]">*</span>
            </label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Type your message here"
              rows={5}
              className={`rounded-lg min-h-[120px] text-base px-4 py-4 border-[1.5px] border-[#D0D5DD] focus:border-blue-500 shadow-sm placeholder:text-muted-foreground${isError ? ' border-[#F04438]' : ''}`}
              style={{ resize: 'none', fontSize: 16, padding: 16 }}
              autoFocus
            />
            {isError && <div className="text-xs text-[#F04438] mt-1">Reason is required</div>}
          </div>

          <div className="w-full mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Click</span>
              <Icons.arrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>to stay back</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Or click</span>
              <Icons.check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>to confirm</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            className="flex-1 h-12 border-border hover:bg-accent hover:text-accent-foreground"
            size="lg"
          >
            <Icons.arrowLeft className="w-5 h-5 mr-2" />
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!remark.trim()}
            type="button"
            className="flex-1 flex justify-center h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium transition-colors"
            size="lg"
          >
            {isUpdating ? <LoadingIndicator /> : <Icons.check className="w-5 h-5 mr-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDepositRequestDialog;
