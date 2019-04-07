import helper from '../../helpers/validation';
import accounts from '../../models/accounts';

class ValidateAccount {
  static postAccount(req, res, next) {
    const { id, type } = req.body;

    const requiredNotGiven = helper.requiredFieldIsGiven({ id, type });

    if (requiredNotGiven) {
      return res.status(400).json({
        status: 400,
        error: requiredNotGiven,
      });
    }

    const isUserIdInRecord = accounts.find(account => account.id === id);

    if (!isUserIdInRecord) {
      return res.status(404).json({
        status: 404,
        error: `user with id: ${id} does not exist in our record`,
      });
    }

    const isTypeString = helper.stringType({ type });
    if (isTypeString) {
      return res.status(400);
    }

    if (type.toLowerCase() !== 'savings' && type.toLowerCase() !== 'current') {
      return res.status(400).json({
        status: 400,
        error: 'Account type must either be savings or current',
      });
    }
    next();
  }
}

export default ValidateAccount;
