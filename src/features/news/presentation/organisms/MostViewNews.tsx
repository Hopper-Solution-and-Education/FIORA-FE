import Image from 'next/image';
import Link from 'next/link';
import { NewsResponse } from '../../api/types/newsDTO';

interface MostViewedNewsProps {
  news: NewsResponse[];
}

// Component cho từng mục tin trong danh sách
const MostViewedItem = ({ title, thumbnail, id }: NewsResponse) => {
  return (
    <li className="py-4">
      <Link href={`/news/details/${id}`} className="flex items-start gap-4 group">
        {typeof thumbnail !== 'undefined' ? (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={thumbnail!}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="64px"
            />
          </div>
        ) : null}

        <div className="flex-grow">
          <h4 className="text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-purple-600 line-clamp-2">
            {title}
          </h4>
        </div>
      </Link>
    </li>
  );
};

const MostViewedNews = ({ news }: MostViewedNewsProps) => {
  return (
    <div className="w-full rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
        Most Viewed News
      </h3>
      <ul className="divide-y divide-slate-100 h-64 overflow-y-scroll lg:h-auto lg:overflow-auto">
        {news.map((item) => (
          <MostViewedItem key={item.id} {...item} />
        ))}
      </ul>
    </div>
  );
};

export default MostViewedNews;
