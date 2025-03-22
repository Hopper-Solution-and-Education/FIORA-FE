import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { Transaction } from '../types/types';

type UpdateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
};

const UpdateTransactionModal = (props: UpdateTransactionModalProps) => {
  const { isOpen, onClose, transaction } = props;

  const handleUpdateTransaction = async () => {
    // Update transaction
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
          {/* <DialogDescription>Please read the terms and conditions carefully.</DialogDescription> */}
        </DialogHeader>
        {/* Dialog content */}
        <div></div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-end items-center gap-5">
          <DialogClose onClick={onClose}>
            <Button className="bg-gray-300 hover:bg-gray-400 text-black min-w-fit">Cancel</Button>
          </DialogClose>

          <DialogTrigger onClick={handleUpdateTransaction}>
            <Button className="bg-blue-100 hover:bg-blue-200 text-blue-800 min-w-fit">
              Update
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTransactionModal;
