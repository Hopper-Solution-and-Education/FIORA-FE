import prisma from '@/infrastructure/database/prisma';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Media, SectionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getSection(req, res);
      case 'POST':
        return await createSection(req, res);
      case 'PUT':
        return await updateSection(req, res);
      case 'DELETE':
        return await deleteSection(req, res);
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
}

async function getSection(req: NextApiRequest, res: NextApiResponse) {
  const { sectionType } = req.query;

  if (!sectionType || !Object.values(SectionType).includes(sectionType as SectionType)) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Invalid or missing section type' });
  }

  const section = await prisma.section.findFirst({
    where: { section_type: sectionType as SectionType },
    orderBy: { createdAt: 'asc' },
    take: 1,
    include: { medias: true },
  });

  if (!section) {
    return res.status(RESPONSE_CODE.NOT_FOUND).json({ error: 'Section not found' });
  }

  return res.status(RESPONSE_CODE.ACCEPTED).json(section);
}

// Tao Section -> Section ở đây có thể là image cho footer
async function createSection(req: NextApiRequest, res: NextApiResponse) {
  const { section_type, name, order, medias, createdBy } = req.body;

  if (!section_type || !Object.values(SectionType).includes(section_type)) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Invalid or missing section type' });
  }
  if (!name) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Section name is required' });
  }
  if (!createdBy) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'CreatedBy user ID is required' });
  }

  try {
    const newSection = await prisma.$transaction(async (prisma) => {
      const section = await prisma.section.create({
        data: {
          section_type,
          name,
          order: order !== undefined ? order : 0,
          createdBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (medias && Array.isArray(medias) && medias.length > 0) {
        await prisma.media.createMany({
          data: medias.map((media: Media) => ({
            media_type: media.media_type,
            media_url: media.media_url || null,
            redirect_url: media.redirect_url || null,
            embed_code: media.embed_code || null,
            description: media.description || null,
            uploaded_by: media.uploaded_by || createdBy || null,
            uploaded_date: new Date(),
            section_id: section.id,
            createdBy: createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        });
      }

      return await prisma.section.findUnique({
        where: { id: section.id },
        include: { medias: true },
      });
    });

    return res.status(RESPONSE_CODE.CREATED).json(newSection);
  } catch (error) {
    console.error('Create Section Error:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to create section' });
  }
}

async function updateSection(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, order, medias, updatedBy } = req.body;

  if (!id) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Section ID is required' });
  }

  try {
    // Start a transaction to ensure atomic updates
    const updatedSection = await prisma.$transaction(async (prisma) => {
      // Update the Section basic fields
      const sectionUpdate = await prisma.section.update({
        where: { id },
        data: {
          name: name !== undefined ? name : undefined,
          order: order !== undefined ? order : undefined,
          updatedAt: new Date(),
          updatedBy: updatedBy || undefined,
        },
        include: { medias: true }, // Include medias to compare later
      });

      // Handle media updates if provided
      if (medias && Array.isArray(medias)) {
        // Fetch existing media for the section
        const existingMedias = sectionUpdate.medias;

        // Prepare media operations
        const mediasToCreate = medias.filter((m: any) => !m.id); // New media items
        const mediasToUpdate = medias.filter(
          (m: any) => m.id && existingMedias.some((em) => em.id === m.id),
        ); // Existing media to update
        const mediasToDelete = existingMedias.filter(
          (em) => !medias.some((m: any) => m.id === em.id),
        ); // Media to delete

        // Create new media items
        if (mediasToCreate.length > 0) {
          await prisma.media.createMany({
            data: mediasToCreate.map((media: any) => ({
              media_type: media.media_type,
              media_url: media.media_url || null,
              redirect_url: media.redirect_url || null,
              embed_code: media.embed_code || null,
              description: media.description || null,
              uploaded_by: media.uploaded_by || updatedBy || null,
              uploaded_date: new Date(),
              section_id: id,
              createdBy: updatedBy || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          });
        }

        // Update existing media items
        for (const media of mediasToUpdate) {
          await prisma.media.update({
            where: { id: media.id },
            data: {
              media_type: media.media_type,
              media_url: media.media_url || null,
              embed_code: media.embed_code || null,
              description: media.description || null,
              updatedAt: new Date(),
              updatedBy: updatedBy || null,
            },
          });
        }

        // Delete media items that are no longer in the list
        if (mediasToDelete.length > 0) {
          await prisma.media.deleteMany({
            where: {
              id: { in: mediasToDelete.map((m) => m.id) },
            },
          });
        }
      }

      // Fetch the updated section with its medias
      return await prisma.section.findUnique({
        where: { id },
        include: { medias: true },
      });
    });

    if (!updatedSection) {
      return res.status(404).json({ error: 'Section not found' });
    }

    return res.status(200).json(updatedSection);
  } catch (error) {
    console.error('Update Section Error:', error);
    return res.status(500).json({ error: 'Failed to update section' });
  }
}

async function deleteSection(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Section ID is required' });
  }

  await prisma.section.delete({
    where: { id },
  });

  return res.status(200).json({ message: 'Section deleted successfully' });
}
