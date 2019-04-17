import pool from './config';

(async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(250) UNIQUE NOT NULL,
      phonenumber VARCHAR(20) NOT NULL,
      password TEXT NOT NULL,
      type VARCHAR(10) NOT NULL,
      isadmin BOOLEAN DEFAULT FALSE,
      createdon TIMESTAMPTZ DEFAULT NOW()
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS accounts(
      id SERIAL PRIMARY KEY,
      accountnumber INT NOT NULL,
      owner SMALLINT NOT NULL,
      type VARCHAR(10) NOT NULL,
      status VARCHAR(10) DEFAULT 'active',
      balance FLOAT(2) NOT NULL,
      createdon TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      type VARCHAR(10) NOT NULL,
      accountnumber INT NOT NULL,
      cashier SMALLINT NOT NULL,
      amount FLOAT(2) NOT NULL,
      oldballance FLOAT(2) NOT NULL,
      newballance FLOAT(2) NOT NULL,
      createdon TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (cashier) REFERENCES users (id) 
    )`);

    await pool.end();
  } catch (err) {
    console.log(err.stack);
  }
})();
