'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

import SessionSidebar from '@/components/providers/SessionSidebar';
import MarkdownPreview from '@/features/faq/presentation/components/faqedit/MarkdownPreview';
import RichTextEditor from '@/features/faq/presentation/components/faqedit/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type FaqFormValues = {
  title: string;
  description: string;
  type: string;
  category: string;
  content: string;
};

export default function EditFaqPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm<FaqFormValues>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      category: '',
      content: '',
    },
  });

  const title = watch('title');
  const [htmlContent, setHtmlContent] = useState('');

  const onSubmit = (data: FaqFormValues) => {
    const finalData = {
      ...data,
      content: htmlContent,
    };
    console.log('Submit:', finalData);
  };

  return (
    <SessionSidebar appLabel="Faq">
      <main className="p-6 pt-24 space-y-8 overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Title" {...register('title', { required: true })} />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select
                onValueChange={(value) =>
                  ((document.getElementsByName('type')[0] as HTMLInputElement).value = value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('type', { required: true })} name="type" />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Short description..."
                {...register('description', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                onValueChange={(value) =>
                  ((document.getElementsByName('category')[0] as HTMLInputElement).value = value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('category', { required: true })} name="category" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Content</Label>
              <RichTextEditor
                value={htmlContent}
                onChange={(value) => {
                  setHtmlContent(value);
                  setValue('content', value);
                }}
              />
            </div>

            <div>
              <Label>Preview</Label>
              <div className="bg-white border p-4 rounded-md overflow-y-auto min-h-[400px] space-y-4">
                <div>
                  <h1
                    className={`text-2xl font-bold ${!title ? 'text-gray-400' : 'text-foreground'}`}
                  >
                    {title || 'Title goes here'}
                  </h1>

                  {!htmlContent && (
                    <p className="italic text-gray-400">Live preview will appear here…</p>
                  )}
                </div>

                {htmlContent && <MarkdownPreview content={htmlContent} />}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-[#E0E0E0] hover:bg-[#d5d5d5] text-black px-8 py-4 rounded-md transition"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              type="submit"
              className="bg-[#3C5588] hover:bg-[#2e446e] px-8 py-4 rounded-md shadow text-white transition"
            >
              <Check size={24} className="text-[#60A673]" />
            </button>
          </div>
        </form>
      </main>
    </SessionSidebar>
  );
}
