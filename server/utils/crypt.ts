import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcrypt.compare(password, hashedPassword);

  return isValid;
};

export const timingSafeEqualCheck = (input: Buffer, allowed: Buffer) =>
  input.byteLength === allowed.byteLength &&
  crypto.timingSafeEqual(input, allowed);
