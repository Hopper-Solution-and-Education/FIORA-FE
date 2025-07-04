'use client';

import { FC, useEffect, useState } from 'react';

interface SuccessToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

const SuccessToast: FC<SuccessToastProps> = ({ title, description, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Bắt đầu fade-in
    setVisible(true);

    // Tự động ẩn sau 3 giây
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    // Cleanup
    return () => clearTimeout(timer);
  }, []);

  // Khi fade-out xong, gọi onClose để remove khỏi DOM
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // Thời gian trùng với duration của transition
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start space-x-3 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ borderBottomWidth: '4px', borderBottomColor: '#4CAF50' }}
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div>
        <p className="font-bold text-black">{title}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SuccessToast;
