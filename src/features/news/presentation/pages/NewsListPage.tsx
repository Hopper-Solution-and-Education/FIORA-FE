import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useNewsData } from '../../hooks/useNewsData';
import { useGetNewsQuery } from '../../store/api/newsApi';
import NewsPageHeader from '../organisms/NewsPageHeader';
import PaginatedPostList from '../organisms/PaginatedPostList';

// A big list of posts to act as our "database"
const allPosts: any[] = [
  // Page 1
  {
    author: { name: 'Huyền Lê Ngọc', avatarUrl: 'https://i.pravatar.cc/150?u=a' },
    title: 'TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++',
    excerpt: 'Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy...',
    tags: ['React Native'],
    time: '5 ngày trước',
    readTime: '2 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
  },
  {
    author: { name: 'Hoàng Tuấn', avatarUrl: 'https://i.pravatar.cc/150?u=b' },
    title: 'Giới thiệu về ngành Công Nghệ Thông Tin',
    excerpt: 'Ngành Công Nghệ Thông Tin (CNTT) là một lĩnh vực đang phát triển...',
    tags: ['hoc-lap-trinh'],
    time: '2 tháng trước',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1550063873-ab792580e014?w=400&q=80',
  },
  {
    author: { name: 'Sơn Đặng', avatarUrl: 'https://i.pravatar.cc/150?u=c' },
    title: "Học viên F8 tỏa sáng với dự án 'AI Powered Learning'",
    excerpt: 'Trong thời đại công nghệ số 4.0, việc học không còn bó buộc...',
    tags: ['ReactJS', 'AI'],
    time: '1 năm trước',
    readTime: '6 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-285f726a8484?w=400&q=80',
  },
  // Page 2
  {
    author: { name: 'Lý Cao Nguyên', avatarUrl: 'https://i.pravatar.cc/150?u=d' },
    title: 'Mình đã làm thế nào để hoàn thành website trong 15 ngày',
    excerpt: 'Xin chào mọi người! Mình là Lý Cao Nguyên, mình đã làm...',
    tags: ['Front-end'],
    time: '1 năm trước',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&q=80',
  },
  {
    author: { name: 'Evich Tran', avatarUrl: 'https://i.pravatar.cc/150?u=e' },
    title: 'Config Zsh bằng Oh-my-zsh và P10k trên WSL',
    excerpt: 'Hello anh em, thì như blog trước mình có nói rằng mình ko có...',
    tags: ['Ubuntu', 'DevOps'],
    time: '1 năm trước',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&q=80',
  },
  {
    author: { name: 'Hòa Nguyễn Thanh', avatarUrl: 'https://i.pravatar.cc/150?u=f' },
    title: "Là thành viên của F8. Bạn đã thực sự sử dụng 'F8' hiệu quả?",
    excerpt: "'F8' sẽ đưa bạn đến chính xác từng vị trí xảy ra vấn đề...",
    tags: ['VSCode', 'Tips'],
    time: '1 năm trước',
    readTime: '12 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&q=80',
  },
  // Page 3
  {
    author: { name: 'Trọng Nam Đoàn', avatarUrl: 'https://i.pravatar.cc/150?u=g' },
    title: 'Tôi đã viết Chrome extension đầu tiên bằng Github Copilot',
    excerpt: 'Câu chuyện của tôi là Tôi đang học tiếng Nhật trên một trang web...',
    tags: ['Javascript', 'AI'],
    time: '1 năm trước',
    readTime: '5 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1610986603195-2715286396c0?w=400&q=80',
  },
  {
    author: { name: 'Hải Đoàn', avatarUrl: 'https://i.pravatar.cc/150?u=h' },
    title: '[HTML - CSS - JS tại F8] Một thời mày mò học',
    excerpt: 'Lục lại được trang web cũ – chia sẻ cùng anh em...',
    tags: ['Javascript'],
    time: '3 tháng trước',
    readTime: '2 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80',
  },
  // No more posts
];

const NewsListPage = () => {
  // Hooks
  // const { data: categoriesWithPost = [] } = useGetFaqCategoriesWithPostQuery({
  //   type: PostType.NEWS,
  //   limit: FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY,
  // });

  const { data: newestNewsList = [], isLoading: loading } = useGetNewsQuery({
    page: 1,
    limit: 3,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });
  const {
    activeFilters,
    expandedCategories,
    expandedCategoryNews,
    // filteredNews,
    handleShowMore,
    hasActiveFilters,
    isLoading,
    newestNews,
    // mostViewedNews,
    handleFilterChange,
  } = useNewsData();
  // const { posts, hasNextPage } = await fetchPosts({ page: 1 });

  console.log(loading);
  console.log('CAC', newestNewsList);

  const { data: session } = useSession() as { data: Session | null };

  const isAdmin = session?.user?.role?.toUpperCase() === USER_ROLES.ADMIN;

  return (
    <div className="w-full px-6 space-y-8 mb-6">
      <NewsPageHeader
        // categories={categoriesWithPost}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        isAdmin={isAdmin}
      />
      <main className="min-h-screen bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* <CardList /> */}
          <PaginatedPostList initialPosts={allPosts} initialHasNextPage={true} />
        </div>
      </main>
    </div>

    //   {/* Main Content */}
    //   {hasActiveFilters ? (
    //     <FilteredCategoriesSection categoriesWithFaqs={filteredFaqs} isLoading={isLoading} />
    //   ) : (
    //     <>
    //       <h3 className="text-2xl font-bold text-center">FAQ Center</h3>
    //       <MostViewedSection faqs={mostViewedFaqs} isLoading={isLoading} />
    //       <CategoriesSection
    //         categoriesWithFaqs={categoriesWithPost || []}
    //         expandedCategories={expandedCategories}
    //         expandedCategoryFaqs={expandedCategoryFaqs}
    //         onShowMore={handleShowMore}
    //         isLoading={isLoading}
    //       />
    //     </>
    //   )}
  );
};

export default NewsListPage;
