import FAQDetail from './presentation/organisms/FaqDetailView';
import { useParams } from 'next/navigation';
export default function FaqDetailPage() {
  const { id } = useParams() as { id: string };
  return (
    <div>
      <FAQDetail id={id} />
    </div>
  );
}
