import { useState, useEffect } from 'react';
import { useForm, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { uploadToFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import {
  CreatePartnerFormData,
  createPartnerSchema,
} from '@/features/partner/schema/createPartner.schema';

export function useCreatePartner(setIsOpen: (open: boolean) => void) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [partners, setPartners] = useState<any[]>([]);

  const form = useForm<CreatePartnerFormData>({
    resolver: yupResolver(createPartnerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      identify: '',
      description: '',
      dob: undefined,
      logo: '',
      taxNo: '',
      phone: '',
      address: '',
      parentId: '',
    },
  });

  async function fetchPartners() {
    try {
      const response = await fetch('/api/partners/partner', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch partners.');
      }

      const data = await response.json();
      console.log(data);
      const topLevelPartners = data.data.filter((partner: any) => partner.parentId !== null);
      setPartners(topLevelPartners);
    } catch (error: unknown) {
      console.error('Error fetching partners:', error);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  async function onSubmit(values: CreatePartnerFormData) {
    try {
      if (!logoFile) {
        toast.error('Please upload a logo before submitting.');
        return;
      }

      const fileExtension = logoFile.name.split('.').pop();
      const fileName = `partner_logo_${uuidv4()}.${fileExtension}`;
      const logoUrl = await uploadToFirebase({
        file: logoFile,
        path: 'partners/logos',
        fileName: fileName,
      });
      values.logo = logoUrl;

      const response = await fetch('/api/partners/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add partner.');
      }

      toast.success('Partner added successfully!', {
        position: 'top-right',
        style: { backgroundColor: '#22c55e', color: 'white' },
      });
      setIsOpen(false);
      form.reset();
      setLogoPreview(null);
      setLogoFile(null);

      // Sau khi thêm mới, cập nhật lại danh sách Partners
      await fetchPartners();
    } catch (error: unknown) {
      console.error('Error submitting data:', error);

      const errorMessage = error instanceof Error ? error.message : 'Something went wrong!';

      toast.error(errorMessage, {
        position: 'top-right',
        style: { backgroundColor: '#ef4444', color: 'white' },
      });
    }
  }

  function handleLogoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: UseFormSetValue<CreatePartnerFormData>,
    clearErrors: UseFormClearErrors<CreatePartnerFormData>,
  ) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setValue('logo', file.name);
      clearErrors('logo');

      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return { form, onSubmit, logoPreview, setLogoPreview, handleLogoChange, partners, fetchPartners };
}
