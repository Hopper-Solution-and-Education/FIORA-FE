import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main id="app-layout" className="h-full flex flex-col">
      {children}
    </main>
  );
};

export default MainLayout;
