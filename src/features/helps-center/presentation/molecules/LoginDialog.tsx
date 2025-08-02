'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from '@/features/auth/presentation/organisms/LoginForm';

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
};

const LoginDialog = (props: LoginDialogProps) => {
  const { onClose, open, callbackUrl = '/' } = props;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[600px] rounded-lg sm:rounded-xl transition-all duration-200">
        <LoginForm callbackUrl={callbackUrl} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
