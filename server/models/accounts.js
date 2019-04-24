import db from '../database/index';

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
   * Gets all accounts in record
   *
   * @static getAll
   * @returns an array of all accounts in record
   * @memberof Accounts
   */
  static async getAll() {
    try {
      const result = await db.queryNoParams(
        'SELECT * FROM accounts ORDER BY id'
      );
      return result.rows;
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Save new account to the accounts table
   *
   * @static saveAccount
   * @param {object} { id, type } - UserId & User Type
   * @returns the new account details
   * @memberof Accounts
   */
  static async save({ id, type }) {
    const name = ['accountnumber', 'owner', 'type'];
    const params = [generateAccountNumber(), id, type];

    try {
      const result = await db.query(
        `INSERT INTO accounts (${name.join(
          ', '
        )}) VALUES ($1, $2, $3) RETURNING *`,
        params
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Finds account details with specified account number
   *
   * @static findByAccountNumber
   * @param {integer} accountnumber
   * @returns account details of the account number specified
   * @memberof Accounts
   */
  static async findByAccountNumber(accountnumber) {
    try {
      const result = await db.query(
        'SELECT * FROM accounts WHERE accountnumber = $1',
        [accountnumber]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Toggles the accounts status from dormant to active and vice versa
   *
   * @static toggleStatus
   * @param {integer} accountnumber
   * @returns account number and new status
   * @memberof Accounts
   */
  static async toggleStatus(accountnumber, status) {
    try {
      const result = await db.query(
        `UPDATE accounts 
      SET status = $2
      WHERE accountnumber = $1 RETURNING accountnumber,status`,
        [accountnumber, status]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Delete account with specified account number
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
        [accountnumber]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Performs debit on account in record
   *
   * @static debit
   * @param {integer} accountnumber
   * @param {integer} amount - amount to be debited
   * @returns
   * @memberof Accounts
   */
  static async debit(accountnumber, amount) {
    try {
      const result = await db.query(
        `UPDATE accounts SET balance = balance - ${amount} 
        WHERE accountnumber = $1 RETURNING balance`,
        [accountnumber]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Performs credit on account in record
   *
   * @static credit
   * @param {object} accountnumber
   * @param {object} amount - amount to be debited
   * @returns
   * @memberof Accounts
   */
  static async credit(accountnumber, amount) {
    try {
      const result = await db.query(
        `UPDATE accounts SET balance = balance + ${amount} 
        WHERE accountnumber = $1 RETURNING balance`,
        [accountnumber]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Gets account owned by specified user id
   *
   * @static getByOwner
   * @param {integer} ownerId
   * @returns
   * @memberof Accounts
   */
  static async getByOwner(ownerId) {
    try {
      const result = await db.query('SELECT * FROM accounts WHERE owner = $1', [
        ownerId
      ]);
      return result.rows;
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Fetches account numbers with the indicated status
   *
   * @static
   * @param {string} accountStatus - account status either dormant or active
   * @returns
   * @memberof Accounts
   */
  static async getByStatus(accountStatus) {
    try {
      const result = await db.query(
        'SELECT * FROM accounts WHERE status = $1',
        [accountStatus]
      );
      return result.rows;
    } catch (err) {
      return err.code;
    }
  }
}

export default Accounts;
