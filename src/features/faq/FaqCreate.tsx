import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditFaqFormUI from '../faq/presentation/CreationPage';

export default function EditFaqPageContainer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    content: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitted:', formData);
    // Submit logic here
  };

  return (
    <EditFaqFormUI
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
