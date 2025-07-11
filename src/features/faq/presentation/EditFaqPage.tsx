'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

import SessionSidebar from '@/components/providers/SessionSidebar';
import RichTextEditor from '@/features/faq/presentation/components/faqedit/RichTextEditor';
import MarkdownPreview from '@/features/faq/presentation/components/faqedit/MarkdownPreview';
import ConfirmExitDialog from '@/features/faq/presentation/organisms/ConfirmExitDialog';

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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [faqRes, catRes] = await Promise.all([
          fetch(`/api/faqs/${id}`),
          fetch('/api/faqs/categories'),
        ]);

        if (!faqRes.ok) throw new Error('Failed to fetch FAQ');
        if (!catRes.ok) throw new Error('Failed to fetch categories');

        const faqData = await faqRes.json();
        const catData = await catRes.json();

        reset({
          title: faqData.title,
          description: faqData.description,
          content: faqData.content,
          categoryId: faqData.categoryId,
        });
        setHtmlContent(faqData.content);
        setCategories(catData.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
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
        toast.error(`Error: ${error.error}`);
        setSaving(false);
        return;
      }

      toast.success(
        <div>
          <strong>Edit FAQ Successfully</strong>
          <div className="text-sm text-gray-600">
            Your invoice request has been recorded and is awaiting processing.
          </div>
        </div>,
      );

      setTimeout(() => {
        router.push(`/faqs/${id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
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
      <main className="p-6 pt-24 space-y-8">
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
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No categories found</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Short description..."
                {...register('description')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="border rounded p-4 min-h-[600px] max-h-[1000px] overflow-y-auto w-full">
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
              onClick={() => setShowConfirmExit(true)}
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

        <ConfirmExitDialog
          open={showConfirmExit}
          onOpenChange={setShowConfirmExit}
          onConfirmExit={() => {
            setShowConfirmExit(false);
            router.back();
          }}
          onCancelExit={() => setShowConfirmExit(false)}
        />

        <ToastContainer position="bottom-left" />
      </main>
    </SessionSidebar>
  );
}
