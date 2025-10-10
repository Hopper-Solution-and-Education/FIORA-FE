import type { UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';

export interface IProfileRepository {
  getById(userId: string): Promise<UserProfile | null>;
  update(userId: string, payload: UpdateProfileRequest, updateBy?: string): Promise<UserProfile>;
}
