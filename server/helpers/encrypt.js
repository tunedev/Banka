import bcrypt from 'bcryptjs';

export const encrypt = async password => bcrypt.hash(password, 8);

export const confirm = async (password, hash) => bcrypt.compare(password, hash);
