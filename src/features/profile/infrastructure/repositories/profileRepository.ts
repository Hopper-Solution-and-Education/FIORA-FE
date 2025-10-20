import { prisma } from '@/config';
import { UserRole } from '@/shared/constants/userRole';
import { removeFromFirebase } from '@/shared/lib';
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
        referrer_code: true,
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
      referrer_code: user.referrer_code ?? null,
    };
  }

  async update(
    userId: string,
    payload: UpdateProfileRequest,
    updateBy?: string,
  ): Promise<UserProfile> {
    // Load current user to know existing attachments
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarId: true, logoId: true, id: true },
    });

    // Handle avatar update
    let avatarResult: { id: string; url: string } | null = null;
    if (payload.avatarAttachmentId) {
      // FE already uploaded and created attachment, just use the ID
      const attachment = await prisma.attachment.findUnique({
        where: { id: payload.avatarAttachmentId },
        select: { id: true, url: true },
      });
      if (attachment) {
        avatarResult = attachment;
        // Delete old attachment if exists
        if (currentUser?.avatarId && currentUser.avatarId !== payload.avatarAttachmentId) {
          await this.deleteAttachmentById(currentUser.avatarId);
        }
      }
    }

    // Handle logo update
    let logoResult: { id: string; url: string } | null = null;
    if (payload.logoAttachmentId) {
      // FE already uploaded and created attachment, just use the ID
      const attachment = await prisma.attachment.findUnique({
        where: { id: payload.logoAttachmentId },
        select: { id: true, url: true },
      });
      if (attachment) {
        logoResult = attachment;
        // Delete old attachment if exists
        if (currentUser?.logoId && currentUser.logoId !== payload.logoAttachmentId) {
          await this.deleteAttachmentById(currentUser.logoId);
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name ?? undefined,
        avatarId: avatarResult?.id ?? undefined,
        logoId: logoResult?.id ?? undefined,
        phone: payload.phone ?? undefined,
        address: payload.address ?? undefined,
        birthday: payload.birthday ? new Date(payload.birthday) : undefined,
        updatedBy: updateBy ?? userId,
        referrer_code: payload.referrer_code ?? undefined,
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
        referrer_code: true,
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
      referrer_code: updated.referrer_code ?? null,
    };
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

  async getByEmail(email: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user) return null;

    const avatarUrl = await this.resolveAttachmentUrl(user.avatarId);
    const logoUrl = await this.resolveAttachmentUrl(user.logoId);

    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      avatarUrl,
      logoUrl,
      phone: user.phone ?? null,
      address: user.address ?? null,
      birthday: user.birthday ? user.birthday.toISOString() : null,
      role: user.role as UserRole,
      eKYC: user.eKYC as unknown as eKYC[],
    };
  }

  async getByIdWithPassword(userId: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async updateEmail(userId: string, email: string): Promise<UserProfile> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email, updatedBy: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarId: true,
        logoId: true,
        phone: true,
        address: true,
        birthday: true,
        role: true,
        eKYC: true,
      },
    });

    const avatarUrl = await this.resolveAttachmentUrl(updated.avatarId);
    const logoUrl = await this.resolveAttachmentUrl(updated.logoId);

    return {
      id: updated.id,
      name: updated.name ?? null,
      email: updated.email,
      avatarUrl,
      logoUrl,
      phone: updated.phone ?? null,
      address: updated.address ?? null,
      birthday: updated.birthday ? updated.birthday.toISOString() : null,
      role: updated.role as UserRole,
      eKYC: updated.eKYC as unknown as eKYC[],
    };
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updatedBy: userId },
    });
  }

  async softDelete(userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Delete all user sessions (logout from all devices)
      await tx.session.deleteMany({
        where: { userId },
      });

      // 2. Soft delete user account
      await tx.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          updatedBy: userId,
          isDeleted: true,
        },
      });
    });
  }
}

export const profileRepository: IProfileRepository = new ProfileRepository();
