import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let dbUrl;

if (process.NODE_ENV === 'test') dbUrl = process.env.DATABASE_URL_TEST;
else if (process.NODE_ENV === 'development') {
  // const {
  //   DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT,
  // } = process.env;

  dbUrl = process.env.DATABASE_URL_DEV;

  // dbUrl = {
  //   user: DB_USER,
  //   host: DB_HOST,
  //   database: DB_DATABASE,
  //   password: DB_PASSWORD,
  //   port: DB_PORT,
  // };
} else {
  dbUrl = process.env.DATABASE_URL;
}

const pool = new Pool({ dbUrl });

export default pool;
