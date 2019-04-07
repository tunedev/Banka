import accounts from '../models/accounts';

class AccountHelper {
  /**
   *helps generate a new account
   *
   * @static generateAccountNumber
   * @returns a ten digit number
   * @memberof AccountHelper
   */
  static generateAccountNumber() {
    const numbers = [];

    const record = accounts.map(account => account.accountNumber);

    while (numbers.length < 10) {
      numbers.push(Math.floor(Math.random() * 10));
    }

    const digitizeNumbers = parseInt(numbers.join(''), 10);

    if (record.includes(digitizeNumbers)) return AccountHelper.generateAccountNumber();

    return digitizeNumbers;
  }

  static saveAccount({ accountNumber, id, type }) {
    accounts.push({
      id: accounts.length + 1,
      accountNumber,
      createdOn: new Date().toString(),
      owner: id,
      type,
      status: 'active',
      balance: 0,
    });
  }
}

export default AccountHelper;
