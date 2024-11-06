import crypto from 'crypto';

export function generateSecretKey(): string {
  return crypto.randomBytes(32).toString('hex');
}