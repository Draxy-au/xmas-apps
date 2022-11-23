import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(iPassword:string, hashedPassword:string) {
  return await compare(iPassword, hashedPassword)
}

