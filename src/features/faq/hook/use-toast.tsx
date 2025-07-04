'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = {
  title: string;
  description?: string;
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (toast: ToastType) => {
    setToast(toast);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white border border-green-500 shadow-lg rounded p-4 z-50">
          <p className="font-bold text-green-600">{toast.title}</p>
          {toast.description && <p className="text-gray-600 text-sm mt-1">{toast.description}</p>}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
