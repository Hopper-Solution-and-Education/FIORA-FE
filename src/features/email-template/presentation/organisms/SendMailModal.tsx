'use client';

import { X, Send, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmailModal } from '@/features/email-template/hooks/useEmailModal';
import { SEND_TO_OPTIONS } from '@/features/email-template/constants';
import { formatRecipientCount } from '@/features/email-template/utils/emailHelpers';

export default function SendMailModal() {
  const {
    isModalOpen,
    sendTo,
    recipients,
    subject,
    handleCloseModal,
    handleSendToChange,
    handleSubjectChange,
    handleSendEmail,
  } = useEmailModal();

  if (!isModalOpen) return null;

  const showRecipients = sendTo === 'personal';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Send Mail</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Send To Options */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Send To</h3>
          <div className="flex gap-6">
            {SEND_TO_OPTIONS.map((option) => (
              <label key={option.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sendTo"
                  value={option.id}
                  checked={sendTo === option.id}
                  onChange={(e) => handleSendToChange(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    sendTo === option.id ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}
                >
                  {sendTo === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-lg text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recipients (only show for Personal) */}
        {showRecipients && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recipients</h3>
            <div className="relative">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{recipients[0]}</span>
                  <button className="bg-gray-200 text-gray-600 rounded px-2 py-1 text-sm">×</button>
                  {recipients.length > 1 && (
                    <span className="text-gray-600 font-medium">
                      {formatRecipientCount(recipients.length)}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Subject */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subject</h3>
          <Input
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            placeholder="Email subject"
            className="text-lg py-3 border-gray-200 focus:border-gray-400"
          />
        </div>

        {/* Template Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Template Preview</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="text-gray-600">Using template: </span>
            <span className="font-medium text-gray-900">Account Verification</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleCloseModal}
            className="px-8 py-3 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
          </Button>
          <Button
            onClick={handleSendEmail}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-5 w-5 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
