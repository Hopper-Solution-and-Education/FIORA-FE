export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

export type UpdateProfileRequest = Partial<Omit<UserProfile, 'id' | 'email'>> & {
  // Restrict updatable fields; email/id immutable here
  name?: string | null;
  image?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};
