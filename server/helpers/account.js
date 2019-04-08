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

  /**
   *helps save a new account in the accounts record
   *
   * @static saveAccount
   * @param {object} { accountNumber, id, type }
   * @memberof AccountHelper
   */
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

  /**
   *helps toggle the specified accounts number's status
   *
   * @static toggleAccountStatus
   * @param {integer} accountNumber
   * @memberof AccountHelper
   */
  static toggleAccountStatus(accountNumber) {
    const targetAccount = accounts.find(account => account.accountNumber === accountNumber);

    targetAccount.status = targetAccount.status === 'active' ? 'dormant' : 'active';
  }

  /**
   *helps delete an account with given account number from accounts record
   *
   * @static deleteAccount
   * @param {object} accountNumber
   * @memberof AccountHelper
   */
  static deleteAccount(accountNumber) {
    const accountsIndex = accounts.findIndex(account => account.accountNumber === accountNumber);

    accounts.splice(accountsIndex, 1);
  }
}

export default AccountHelper;
