import { screen } from '@testing-library/react';
import Page from '@/app/dashboard/product/page';
import AccountPage from '@/app/dashboard/profile/page';
import { renderWithProviders } from '@/lib/test-utils';
import '@testing-library/jest-dom';

describe('Page', () => {
  // testing with client components
  it('renders client component', () => {
    renderWithProviders(<AccountPage />);

    screen.debug();

    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  // testing with Server components
  it('renders server component', async () => {
    renderWithProviders(await Page());
    screen.debug();

    expect(screen.getByText('Product Page')).toBeInTheDocument();
  });
});
