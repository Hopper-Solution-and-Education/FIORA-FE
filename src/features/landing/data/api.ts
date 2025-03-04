export const fetchMedia = async (sectionType: string) => {
  const res = await fetch(`/api/media?sectionType=${sectionType}`);
  return res.json();
};
