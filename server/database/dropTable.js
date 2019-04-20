import db from './index';

(async () => {
  console.log('Dropping Tables in database');
  try {
    await db.queryNoParams('DROP TABLE IF EXISTS users CASCADE');
    await db.queryNoParams('DROP TABLE IF EXISTS accounts CASCADE');
    await db.queryNoParams('DROP TABLE IF EXISTS transactions CASCADE');
  } catch (err) {
    return err.stack;
  }
})();
