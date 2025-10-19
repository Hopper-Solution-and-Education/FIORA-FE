import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
  return <main id="app-layout">{children}</main>;
};

export default MainLayout;
