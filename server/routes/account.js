import express from 'express';

import accountController from '../controllers/account';
import accountValidation from '../middleware/validate/account';

const router = express.Router();

router.post('/', accountValidation.postAccount, accountController.postAccount);
router.patch('/:accountNumber', accountValidation.accountNumber, accountController.patchAccount);
router.delete('/:accountNumber', accountValidation.accountNumber, accountController.deleteAccount);
router.post(
  '/:accountNumber/debit',
  accountValidation.accountNumber,
  accountValidation.transaction,
  accountValidation.confirmSufficientBalance,
  accountController.postDebit,
);
router.post(
  '/:accountNumber/credit',
  accountValidation.accountNumber,
  accountValidation.transaction,
  accountController.postCredit,
);

export default router;
