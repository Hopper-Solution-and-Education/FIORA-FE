'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'secondary' | 'ghost';
  children?: React.ReactNode;
}

const CopyButton = ({ text, variant = 'secondary', children }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button variant={variant} onClick={handleCopy}>
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
      {children || (copied ? 'Copied' : 'Copy')}
    </Button>
  );
};

export default CopyButton;
