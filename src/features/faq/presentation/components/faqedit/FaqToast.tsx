'use client';

import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'top-left',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

export const FaqToastContainer = () => <ToastContainer {...defaultOptions} />;

export const showSuccessToast = (title: string, description: string) => {
  toast.success(
    <div>
      <strong>{title}</strong>
      <div className="text-sm text-gray-600">{description}</div>
    </div>,
    defaultOptions,
  );
};

export const showErrorToast = (message: string) => {
  toast.error(message, defaultOptions);
};
