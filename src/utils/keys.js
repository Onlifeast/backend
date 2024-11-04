import crypto from 'crypto';

export function generateSecretKey() {
  return crypto.randomBytes(32).toString('hex');
}