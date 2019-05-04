import db from '../database/index';

class Transactions {
  /**
   *saves transaction to database
   *
   * @static save
   * @param {object} {
   *     transactionType,
   accountNumber,
   cashierId,
   amount,
   oldBalance,
   newBalance,
   *   }
   * @returns transations details
   * @memberof Transactions
   */
  static async save({
    transactionType,
    accountNumber,
    cashierId,
    amount,
    oldBalance,
    newBalance,
    remarks
  }) {
    const names = [
      'type',
      'accountnumber',
      'cashier',
      'amount',
      'oldbalance',
      'newbalance',
      'remarks'
    ];
    const params = [
      transactionType,
      accountNumber,
      cashierId,
      amount,
      oldBalance,
      newBalance,
      remarks
    ];

    try {
      const result = await db.query(
        `INSERT INTO transactions (${names.join(
          ', '
        )}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        params
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   *Gets transaction with specified account number
   *
   * @static getByAccountNumber
   * @param {number} accountnumber
   * @returns an array of all transactions with account number
   * @memberof Transactions
   */
  static async getByAccountNumber(accountnumber) {
    try {
      const result = await db.query(
        'SELECT * FROM transactions WHERE accountnumber = $1',
        [accountnumber]
      );
      return result.rows;
    } catch (err) {
      return err.code;
    }
  }

  /**
   * Fetches transaction details with account number and id
   *
   * @static getByAccountNumberAndId
   * @param {integer} accountnumber
   * @param {integer} id - transaction-id
   * @returns
   * @memberof Transactions
   */
  static async getByAccountNumberAndId(accountnumber, id) {
    try {
      const result = await db.query(
        'SELECT * FROM transactions WHERE accountnumber = $1 AND id = $2',
        [accountnumber, id]
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }
}

export default Transactions;
