export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

export type UpdateProfileRequest = Partial<Omit<UserProfile, 'id' | 'email'>> & {
  // Restrict updatable fields; email/id immutable here
  name?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
  newAvatar?: File | null;
  newLogo?: File | null;
};
