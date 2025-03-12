import prisma from '@/infrastructure/database/prisma';
import { SectionType } from '@prisma/client';
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getSection(req: NextApiRequest, res: NextApiResponse) {
  const { sectionType } = req.query;

  if (!sectionType || !Object.values(SectionType).includes(sectionType as SectionType)) {
    return res.status(400).json({ error: 'Invalid or missing section type' });
  }

  const section = await prisma.section.findFirst({
    where: { section_type: sectionType as SectionType },
    orderBy: { createdAt: 'asc' },
    take: 1,
    include: { medias: true },
  });

  if (!section) {
    return res.status(404).json({ error: 'Section not found' });
  }

  return res.status(200).json(section);
}

async function createSection(req: NextApiRequest, res: NextApiResponse) {
  const { section_type, name, order } = req.body;

  if (!section_type || !Object.values(SectionType).includes(section_type)) {
    return res.status(400).json({ error: 'Invalid section type' });
  }

  const { userId } = req.body;
  const newSection = await prisma.section.create({
    data: {
      section_type,
      name,
      order,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return res.status(201).json(newSection);
}

async function updateSection(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Section ID is required' });
  }

  const updatedSection = await prisma.section.update({
    where: { id },
    data: {
      name,
      order,
      updatedAt: new Date(),
    },
  });

  return res.status(200).json(updatedSection);
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
