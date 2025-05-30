export function sanitizeDateFilters(filters: any) {
  const cloned = { ...filters };

  if (cloned.dob) {
    const dob = { ...cloned.dob };

    if (dob.gte && typeof dob.gte === 'string') {
      dob.gte = new Date(dob.gte);
    }

    if (dob.lte && typeof dob.lte === 'string') {
      dob.lte = new Date(dob.lte);
    }

    cloned.dob = dob;
  }

  return cloned;
}
