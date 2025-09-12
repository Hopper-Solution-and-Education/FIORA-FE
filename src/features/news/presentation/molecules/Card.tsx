import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { NewsResponse } from '../../api/types/newsDTO'; // Giả sử DTO của bạn ở đây
import Tag from '../atoms/Tag';

// Thêm className vào props để có thể tùy chỉnh từ bên ngoài
interface CardProps extends NewsResponse {
  className?: string;
}

const Card = ({
  title,
  // content, // Thường không hiển thị toàn bộ content trên card
  type,
  description,
  categoryId,
  id,
  // userId, // Không dùng để hiển thị
  className,
}: CardProps) => {
  const router = useRouter();
  const handleClick = () => router.push(`/news/details/${id}`);
  return (
    <div
      className={cn(
        'flex w-full cursor-pointer flex-col rounded-xl border border-transparent bg-background p-5 shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1',
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex-grow">
        <h2 className="mb-2 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-purple-600">
          {title}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {type && <Tag className="bg-blue-100 text-blue-800 font-semibold">{type}</Tag>}
          {categoryId && <Tag>Category: {categoryId}</Tag>}
        </div>
      </div>
    </div>
  );
};

export default Card;
