import bcrypt from 'bcrypt';

/**
 * Hash and salt a password for DB entry
 * @param pass Plain text password
 */
export const hashPassword = async (pass: string): Promise<string> =>
  bcrypt.hash(pass, 10);


/**
 * Compare plain text password against hashed password
 * @param plainTextPass Plain text password
 * @param hashedPass Hashed password
 */
export const comparePassword = async (
  plainTextPass: string,
  hashedPass: string
): Promise<Boolean> =>
  bcrypt.compare(plainTextPass, hashedPass);
