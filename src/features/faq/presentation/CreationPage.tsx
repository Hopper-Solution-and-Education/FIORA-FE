'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import axios from 'axios';

import MarkdownPreview from '@/features/faq/presentation/components/faqedit/MarkdownPreview';
import RichTextEditor from '@/features/faq/presentation/components/faqedit/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type FaqFormValues = {
  title: string;
  description: string;
  category: string;
  content: string;
};

export default function EditFaqPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, reset } = useForm<FaqFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      content: '',
    },
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    axios.get('/api/faqs/faqcreation').then((res) => setCategories(res.data));
  }, []);
  const onSubmit = async (data: FaqFormValues) => {
    setLoading(true);
    try {
      await axios.post('/api/faqs/faqcreation', {
        title: data.title,
        description: data.description,
        content: htmlContent,
        categoryId: data.category,
        attachmentIds,
      });
      reset();
      setHtmlContent('');
      setAttachmentIds([]);
      localStorage.setItem('faq_create_success', '1');
      router.push('/faqs');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || '❌ Có lỗi xảy ra');
    }
    setLoading(false);
  };
  const title = watch('title');

  return (
    <main className="p-6 pt-24 space-y-8 overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="Title" {...register('title', { required: true })} />
          </div>

          {/* Hiển thị trường Type (cứng là FAQ) */}
          <div>
            <Label htmlFor="type">Type *</Label>
            <Input
              id="type"
              value="FAQ"
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
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
            <select
              {...register('category', { required: true })}
              className="border rounded px-2 py-1 w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Content *</Label>
            <RichTextEditor
              value={htmlContent}
              onChange={(value) => {
                setHtmlContent(value);
                setValue('content', value);
              }}
              textareaRef={textareaRef}
              onUploadSuccess={(id: string) => setAttachmentIds((prev) => [...prev, id])}
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
            disabled={loading}
            className="bg-[#3C5588] hover:bg-[#2e446e] px-8 py-4 rounded-md shadow text-white transition"
          >
            <Check size={24} className="text-[#60A673]" />
          </button>
        </div>

        {message && <div className="mt-4 text-center text-sm">{message}</div>}
      </form>
    </main>
  );
}
