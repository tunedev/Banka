import sgmail from '@sendgrid/mail';
import moment from 'moment';
import users from '../models/users';

require('dotenv').config();

sgmail.setApiKey(process.env.SGMAIL_API_KEY);

class EmailNotification {
  /**
   * @description handles email notification for each transaction
   *
   * @static
   * @param {object} transactionDetails - details of the transaction
   * @param {integer} ownerId - bank account owner's id
   * @memberof EmailNotification
   */
  static async transactionAlert(transactionDetails, ownerId) {
    const userDetails = await users.getById(ownerId);

    const { email, firstname, lastname } = userDetails;
    const {
      type,
      amount,
      oldbalance,
      newbalance,
      accountnumber,
      createdon
    } = transactionDetails;

    const msg = {
      from: { email: 'swisskid95@gmail.com', name: 'Banka' },
      to: email,
      subject: `Transaction alert [${type}: ${amount}]`,
      text: `Dear ${firstname} ${lastname},
      This is to inform you that a ${type} transaction
      occured on your Banka bank account with the below details
      
      Account Number: ${accountnumber},
      Amount: ${amount}
      Old Balance: ${oldbalance}
      New Balance: ${newbalance}
      Transaction Occured: ${moment(createdon, 'MMMM-Do-YYYY HH:mm')}`
    };

    sgmail
      .send(msg)
      .then(() => {
        console.log('Mail sent successfully');
      })
      .catch((e) => {
        console.log(e.toString());
      });
  }
}

export default EmailNotification;
