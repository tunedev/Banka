import db from './index';

(async () => {
  console.log('Creating tables in database');
  try {
    await db.queryNoParams(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(250) UNIQUE NOT NULL,
      phonenumber VARCHAR(20) NOT NULL,
      password VARCHAR(255) NOT NULL,
      type VARCHAR(10) NOT NULL,
      isadmin BOOLEAN DEFAULT FALSE,
      createdon TIMESTAMPTZ DEFAULT NOW()
    )`);

    await db.queryNoParams(`CREATE TABLE IF NOT EXISTS accounts(
      id SERIAL PRIMARY KEY,
      accountnumber BIGINT UNIQUE NOT NULL,
      owner SMALLINT NOT NULL,
      type VARCHAR(10) NOT NULL,
      status VARCHAR(10) DEFAULT 'active',
      balance FLOAT(2) DEFAULT 0.00,
      createdon TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
    )`);

    await db.queryNoParams(`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      type VARCHAR(10) NOT NULL,
      accountnumber BIGINT NOT NULL,
      cashier SMALLINT NOT NULL,
      amount FLOAT(2) NOT NULL,
      oldbalance FLOAT(2) NOT NULL,
      newbalance FLOAT(2) NOT NULL,
      createdon TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (cashier) REFERENCES users (id) 
    )`);
  } catch (err) {
    return err.stack;
  }
})();
