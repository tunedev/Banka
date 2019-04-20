import express from 'express';
import userValidation from '../middleware/validation/userValidation';
import userController from '../controllers/userController';
import accountController from '../controllers/accountController';
import accountValidation from '../middleware/validation/accountValidation';

const router = express.Router();

// Entry endpoint of the app's version 1
router.get('/', (req, res) => {
  res.status(200).send('Welcome to Banka api version 1');
});

// Users endpoint
router
  .post('/auth/signup', userValidation.validateSignup, userController.userSignup)
  .post('/auth/signin', userValidation.validateSignin, userController.userSignin);

// Accounts endpoint
router
  .post('/accounts/', accountValidation.postAccount, accountController.postAccount)
  .patch(
    '/accounts/:accountNumber',
    accountValidation.accountNumber,
    accountController.patchAccount,
  )
  .delete(
    '/accounts/:accountNumber',
    accountValidation.accountNumber,
    accountController.deleteAccount,
  )
  .post(
    '/accounts/:accountNumber/debit',
    accountValidation.accountNumber,
    accountValidation.transaction,
    accountValidation.confirmSufficientBalance,
    accountController.postDebit,
  )
  .post(
    '/accounts/:accountNumber/credit',
    accountValidation.accountNumber,
    accountValidation.transaction,
    accountController.postCredit,
  )
  .get(
    '/accounts/:accountNumber/transactions',
    accountValidation.accountNumber,
    accountController.getAllTransactions,
  );

export default router;
