import type { UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';
import type { IProfileRepository } from '../../domain/repositories/profileRepository.interface';
import { profileRepository } from '../../infrastructure/repositories/profileRepository';

class ProfileUseCase {
  constructor(private repo: IProfileRepository) {}

  async getById(userId: string): Promise<UserProfile | null> {
    return this.repo.getById(userId);
  }

  async update(
    userId: string,
    payload: UpdateProfileRequest,
    updateBy?: string,
  ): Promise<UserProfile> {
    return this.repo.update(userId, payload, updateBy);
  }
}

export const profileUseCase = new ProfileUseCase(profileRepository);
