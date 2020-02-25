import crypto from 'crypto';

export const getHash = (str: string) => crypto.createHash('md5').update(str).digest('hex');
