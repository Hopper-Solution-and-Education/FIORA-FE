import { prisma } from '@/config';
import type { UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';
import type { IProfileRepository } from '../../domain/repositories/profileRepository.interface';

class ProfileRepository implements IProfileRepository {
  async getById(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      image: user.image ?? null,
    };
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      image: user.image ?? null,
    };
  }

  async update(userId: string, payload: UpdateProfileRequest): Promise<UserProfile> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name ?? undefined,
        image: payload.image ?? undefined,
      },
      select: { id: true, name: true, email: true, image: true },
    });
    return {
      id: updated.id,
      name: updated.name ?? null,
      email: updated.email,
      image: updated.image ?? null,
    };
  }
}

export const profileRepository: IProfileRepository = new ProfileRepository();
