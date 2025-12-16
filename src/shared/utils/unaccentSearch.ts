import { prisma } from '@/config';
import { normalizeVietnamese } from './stringHelper';

export async function searchWithUnaccentFallback<T = any>(
  tableName: string,
  userId: string,
  search: string,
  columns: string[],
): Promise<T[]> {
  const normalized = normalizeVietnamese(search.toLowerCase());

  const orConditions = columns
    .map((col) => `unaccent("${col}") ILIKE unaccent('%' || $2 || '%')`)
    .join(' OR ');

  const query = `
    SELECT * FROM "${tableName}"
    WHERE "userId"::text = $1 AND (${orConditions})
  `;

  return (await prisma.$queryRawUnsafe(query, userId, normalized)) as T[];
}
