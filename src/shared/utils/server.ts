'use server';
import { randomBytes } from 'node:crypto';

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
