import prisma from '@/infrastructure/database/prisma';
import { SectionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { sectionType } = req.query;

    if (sectionType && !Object.values(SectionType).includes(sectionType as SectionType)) {
      return res.status(400).json({ error: 'Invalid section type' });
    }

    const sections = await prisma.section.findMany({
      where: sectionType ? { section_type: sectionType as SectionType } : {},
      include: {
        medias: true, // Lấy luôn danh sách media trong từng section
      },
    });

    return res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
