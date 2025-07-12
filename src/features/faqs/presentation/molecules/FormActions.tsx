import { ArrowLeft, Check } from 'lucide-react';
import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  disabled?: boolean;
  showIcons?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  disabled = false,
  showIcons = true,
}) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="flex justify-between items-center pt-8">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSubmitting}
        className={`
          bg-[#E0E0E0] hover:bg-[#d5d5d5] text-black px-8 py-4 rounded-md transition-colors
          flex items-center justify-center gap-2 min-w-[100px]
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
        `}
      >
        {showIcons && <ArrowLeft size={20} />}
        {!showIcons && cancelText}
      </button>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting}
        className={`
          bg-[#3C5588] hover:bg-[#2e446e] px-8 py-4 rounded-md shadow text-white transition-colors
          flex items-center justify-center gap-2 min-w-[100px]
          ${disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        `}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {showIcons && <Check size={20} className="text-[#60A673]" />}
            {!showIcons && submitText}
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;
