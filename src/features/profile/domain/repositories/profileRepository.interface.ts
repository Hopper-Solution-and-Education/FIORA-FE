import type { UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';

export interface IProfileRepository {
  getById(userId: string): Promise<UserProfile | null>;
  getByEmail(email: string): Promise<UserProfile | null>;
  getByIdWithPassword(userId: string): Promise<any>;
  update(userId: string, payload: UpdateProfileRequest, updateBy?: string): Promise<UserProfile>;
  updateEmail(userId: string, email: string): Promise<UserProfile>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  softDelete(userId: string): Promise<void>;
}
