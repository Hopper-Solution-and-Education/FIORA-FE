import { randomBytes } from 'node:crypto';
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
export function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Referral code generation constants
export const REFERRAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const REFERRAL_CODE_LENGTH = 10;
export const REFERRAL_CODE_MAX_ATTEMPTS = 10;

/**
 * Builds a random referral code candidate using the defined alphabet
 * @param length - Length of the code to generate (default: REFERRAL_CODE_LENGTH)
 * @returns A random string of the specified length
 */
export function buildReferralCodeCandidate(length = REFERRAL_CODE_LENGTH): string {
  const bytes = randomBytes(length);
  let code = '';
  for (let index = 0; index < length; index += 1) {
    code += REFERRAL_CODE_ALPHABET[bytes[index] % REFERRAL_CODE_ALPHABET.length];
  }
  return code;
}
