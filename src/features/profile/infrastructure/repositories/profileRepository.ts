import { prisma } from '@/config';
import { UserRole } from '@/shared/constants/userRole';
import { removeFromFirebase, uploadToFirebase } from '@/shared/lib';
import type { eKYC, UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';
import type { IProfileRepository } from '../../domain/repositories/profileRepository.interface';

class ProfileRepository implements IProfileRepository {
  async getById(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarId: true,
        birthday: true,
        phone: true,
        logoId: true,
        address: true,
        role: true,
        eKYC: true,
      },
    });
    let avatarUrl = null;
    let logoUrl = null;

    if (!user) return null;
    if (user.avatarId) {
      const attachment = await prisma.attachment.findUnique({
        where: { id: user.avatarId },
      });
      if (attachment) {
        avatarUrl = attachment.url;
      }
    }
    if (user.logoId) {
      const attachment = await prisma.attachment.findUnique({
        where: { id: user.logoId },
      });
      if (attachment) {
        logoUrl = attachment.url;
      }
    }
    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      avatarUrl: avatarUrl,
      logoUrl: logoUrl,
      phone: user.phone ?? null,
      address: user.address ?? null,
      birthday: user.birthday ? user.birthday.toISOString() : null,
      role: user.role as UserRole,
      eKYC: user.eKYC as unknown as eKYC[],
    };
  }

  async update(userId: string, payload: UpdateProfileRequest): Promise<UserProfile> {
    // Load current user to know existing attachments
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarId: true, logoId: true, id: true },
    });

    const avatarResult = await this.applyImageUpdate({
      currentAttachmentId: currentUser?.avatarId ?? null,
      newFile: payload.newAvatar ?? null,
      newUrl: payload.avatarUrl ?? null,
      path: 'users/avatar',
    });

    const logoResult = await this.applyImageUpdate({
      currentAttachmentId: currentUser?.logoId ?? null,
      newFile: payload.newLogo ?? null,
      newUrl: payload.logoUrl ?? null,
      path: 'users/logo',
    });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name ?? undefined,
        avatarId: avatarResult?.id ?? undefined,
        logoId: logoResult?.id ?? undefined,
        phone: payload.phone ?? undefined,
        address: payload.address ?? undefined,
        birthday: payload.birthday ? new Date(payload.birthday) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarId: true,
        logoId: true,
        phone: true,
        address: true,
        birthday: true,
      },
    });
    // Determine final URLs: prefer newly created ones; otherwise resolve existing attachments if any
    const finalAvatarUrl: string | null =
      avatarResult?.url ?? (await this.resolveAttachmentUrl(updated.avatarId));
    const finalLogoUrl: string | null =
      logoResult?.url ?? (await this.resolveAttachmentUrl(updated.logoId));

    return {
      id: updated.id,
      name: updated.name ?? null,
      email: updated.email,
      avatarUrl: finalAvatarUrl,
      logoUrl: finalLogoUrl,
      phone: updated.phone ?? null,
      address: updated.address ?? null,
      birthday: updated.birthday ? updated.birthday.toISOString() : null,
    };
  }

  private async uploadNewImage(file: File, path: string): Promise<{ id: string; url: string }> {
    const url = await uploadToFirebase({ file, path });
    const created = await prisma.attachment.create({
      data: { url, path, type: 'image' },
      select: { id: true, url: true },
    });
    return created;
  }

  private async createAttachmentFromUrl(
    url: string,
    path: string,
  ): Promise<{ id: string; url: string }> {
    const created = await prisma.attachment.create({
      data: { url, path, type: 'image' },
      select: { id: true, url: true },
    });
    return created;
  }

  private async deleteAttachmentById(attachmentId: string): Promise<void> {
    const existing = await prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!existing) return;
    await prisma.attachment.delete({ where: { id: attachmentId } });
    await removeFromFirebase(existing.url);
  }

  private async resolveAttachmentUrl(attachmentId?: string | null): Promise<string | null> {
    if (!attachmentId) return null;
    const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } });
    return attachment?.url ?? null;
  }

  private async applyImageUpdate(args: {
    currentAttachmentId: string | null;
    newFile: File | null;
    newUrl: string | null;
    path: string;
  }): Promise<{ id: string; url: string } | null> {
    const { currentAttachmentId, newFile, newUrl, path } = args;
    if (!newFile && !newUrl) return null;

    const created = newFile
      ? await this.uploadNewImage(newFile, path)
      : await this.createAttachmentFromUrl(newUrl as string, path);

    if (currentAttachmentId) {
      await this.deleteAttachmentById(currentAttachmentId);
    }
    return created;
  }
}

export const profileRepository: IProfileRepository = new ProfileRepository();
