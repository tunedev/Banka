import db from './index';

const hash = '$2a$08$9ozIaZkedKLgH1wUP.q/SeG0ITDiX5CKNKERuvlyHUL89SHa78n3K';
(async () => {
  console.log('seeding database with dummy data');

  const name = [
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'password',
    'type',
    'isadmin'
  ];
  const params = [
    'Sanusi',
    'Babatunde',
    'admin@banka.com',
    '+23487988943',
    hash,
    'admin',
    true
  ];
  try {
    db.query(
      `INSERT INTO users (${name.join(
        ', '
      )}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      params
    );
  } catch (err) {
    return err.stack;
  }
})();

(async () => {
  const name = [
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'password',
    'type',
    'isadmin'
  ];
  const params = [
    'Kenny',
    'Hood',
    'staffadmin@banka.com',
    '+23487989273',
    hash,
    'staff',
    true
  ];
  try {
    db.query(
      `INSERT INTO users (${name.join(
        ', '
      )}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      params
    );
  } catch (err) {
    return err.stack;
  }
})();

(async () => {
  const name = [
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'password',
    'type'
  ];
  const params = [
    'Jenny',
    'Flair',
    'staffcashier@banka.com',
    '+23487989273',
    hash,
    'staff'
  ];
  try {
    db.query(
      `INSERT INTO users (${name.join(
        ', '
      )}) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      params
    );
  } catch (err) {
    return err.stack;
  }
})();

(async () => {
  const name = [
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'password',
    'type'
  ];
  const params = [
    'Jonny',
    'Doe',
    'clientmail@mail.com',
    '+23478635334',
    hash,
    'client'
  ];
  try {
    db.query(
      `INSERT INTO users (${name.join(
        ', '
      )}) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      params
    );
  } catch (err) {
    return err.stack;
  }
})();
