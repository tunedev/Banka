import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let connectionString;

if (process.env.NODE_ENV === 'test') connectionString = process.env.DATABASE_URL_TEST;
else if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.DATABASE_URL_DEV;
}

const pool = new Pool({ connectionString });

export default {
  query: (sqlCommand, params) => pool.query(sqlCommand, params),
  queryNoParams: sqlCommand => pool.query(sqlCommand),
};
