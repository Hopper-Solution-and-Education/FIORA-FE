import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DeleteTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
};

const DeleteTransactionModal = (props: DeleteTransactionModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isOpen, onClose, transactionId } = props;

  const handleDeleteTransaction = async () => {
    // Delete transaction
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Transaction</DialogTitle>
        </DialogHeader>
        {/* Dialog content */}
        <DialogDescription>
          Please make sure that you want to delete this transaction
        </DialogDescription>

        <DialogFooter className="w-full h-fit flex flex-row !justify-end items-center gap-5">
          <DialogClose onClick={onClose}>
            <Button className="bg-gray-300 hover:bg-gray-400 text-black min-w-fit">Cancel</Button>
          </DialogClose>

          <DialogTrigger onClick={handleDeleteTransaction}>
            <Button className="bg-red-100 hover:bg-red-200 text-red-700 min-w-fit">Delete</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionModal;
