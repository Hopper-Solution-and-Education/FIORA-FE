'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

import SessionSidebar from '@/components/providers/SessionSidebar';
import RichTextEditor from '@/features/faq/presentation/components/faqedit/RichTextEditor';
import MarkdownPreview from '@/features/faq/presentation/components/faqedit/MarkdownPreview';

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

import SuccessToast from '@/features/faq/hook/SuccessToast';

type FaqFormValues = {
  title: string;
  description: string;
  content: string;
  categoryId: string;
};

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { register, handleSubmit, setValue, watch, reset } = useForm<FaqFormValues>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      categoryId: '',
    },
  });

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/faqs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        reset({
          title: data.title,
          description: data.description,
          content: data.content,
          categoryId: data.categoryId,
        });
        setHtmlContent(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (formData: FaqFormValues) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: htmlContent,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error: ${error.error}`);
        setSaving(false);
        return;
      }

      setShowSuccess(true);

      setTimeout(() => {
        router.push(`/faqs/${id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const description = watch('description');

  if (loading) {
    return (
      <SessionSidebar appLabel="Faq">
        <main className="p-6 pt-24">Loading...</main>
      </SessionSidebar>
    );
  }

  return (
    <SessionSidebar appLabel="Faq">
      <main className="p-6 pt-24 space-y-8 overflow-auto">
        {showSuccess && (
          <SuccessToast
            title="Edit FAQ Successfully"
            description="Your invoice request has been recorded and is awaiting processing."
            onClose={() => setShowSuccess(false)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Title" {...register('title', { required: true })} />
            </div>

            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                onValueChange={(value) => setValue('categoryId', value)}
                value={watch('categoryId')}
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
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Short description..."
                {...register('description')}
                disabled
              />
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
                <p className="text-gray-600">{description}</p>
                {!htmlContent && (
                  <p className="italic text-gray-400">Live preview will appear here…</p>
                )}
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
              disabled={saving}
              className="bg-[#3C5588] hover:bg-[#2e446e] px-8 py-4 rounded-md shadow text-white transition flex items-center justify-center min-w-[100px]"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check size={24} className="text-[#60A673]" />
              )}
            </button>
          </div>
        </form>
      </main>
    </SessionSidebar>
  );
}
