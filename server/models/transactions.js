import db from '../database/index';

class Transactions {
  static async save({
    transactionType, accountNumber, cashierId, amount, oldBalance, newBalance,
  }) {
    const names = ['type', 'accountnumber', 'cashier', 'amount', 'oldbalance', 'newbalance'];
    const params = [transactionType, accountNumber, cashierId, amount, oldBalance, newBalance];

    try {
      const result = await db.query(
        `INSERT INTO transactions (${names.join(', ')}) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        params,
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }
}

export default Transactions;
