import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds: number = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
