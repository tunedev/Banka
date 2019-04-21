import db from '../database/index';

// generate a random ten(10) digit
const generateAccountNumber = () => {
  const numbers = [];

  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 10));
  }

  const digitizeNumbers = parseInt(numbers.join(''), 10);

  return digitizeNumbers;
};

class Accounts {
  /**
   *Save new account to the accounts table
   *
   * @static saveAccount
   * @param {object} { id, type }
   * @returns the new account details
   * @memberof Accounts
   */
  static async save({ id, type }) {
    const name = ['accountnumber', 'owner', 'type'];
    const params = [generateAccountNumber(), id, type];

    try {
      const result = await db.query(
        `INSERT INTO accounts (${name.join(', ')}) VALUES ($1, $2, $3) RETURNING *`,
        params,
      );
      return result.rows[0];
    } catch (err) {
      return err.stack;
    }
  }

  /**
   *finds account details with specified account number
   *
   * @static findByAccountNumber
   * @param {integer} accountnumber
   * @returns account details of the account number specified
   * @memberof Accounts
   */
  static async findByAccountNumber(accountnumber) {
    try {
      const result = await db.query('SELECT * FROM accounts WHERE accountnumber = $1', [
        accountnumber,
      ]);
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   *toggles the accounts status from dormant to active and vice versa
   *
   * @static toggleStatus
   * @param {integer} accountnumber
   * @returns account number and new status
   * @memberof Accounts
   */
  static async toggleStatus(accountnumber) {
    try {
      const result = await db.query(
        `UPDATE accounts 
      SET status = CASE WHEN status = 'active' THEN 'dormant'
      WHEN status = 'dormant' THEN 'active' END
      WHERE accountnumber = $1 RETURNING accountnumber,status`,
        [accountnumber],
      );
      return result.rows[0];
    } catch (err) {
      return err.stack;
    }
  }

  /**
   *delete account with specified account number
   *
   * @static delete
   * @param {integer} accountnumber
   * @returns account number of account deleted
   * @memberof Accounts
   */
  static async delete(accountnumber) {
    try {
      const result = await db.query(
        'DELETE FROM accounts WHERE accountnumber = $1 RETURNING accountnumber',
        [accountnumber],
      );
      return result.rows[0];
    } catch (err) {
      return err.stack;
    }
  }

  static async debit(accountnumber, amount) {
    try {
      const result = await db.query(
        `UPDATE accounts SET balance = balance - ${amount} WHERE accountnumber = $1 RETURNING balance`,
        [accountnumber],
      );
      return result.rows[0];
    } catch (err) {
      return err.stack;
    }
  }

  static async credit(accountnumber, amount) {
    try {
      const result = await db.query(
        `UPDATE accounts SET balance = balance + ${amount} WHERE accountnumber = $1 RETURNING balance`,
        [accountnumber],
      );
      return result.rows[0];
    } catch (err) {
      return err.stack;
    }
  }

  static async getByOwner(ownerId) {
    try {
      const result = await db.query('SELECT * FROM accounts WHERE owner = $1', [ownerId]);
      return result.rows;
    } catch (err) {
      return err.stack;
    }
  }
}

export default Accounts;
