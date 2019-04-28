import express from 'express';
import userValidation from '../middleware/validation/userValidation';
import userController from '../controllers/userController';
import accountController from '../controllers/accountController';
import accountValidation from '../middleware/validation/accountValidation';
import authorization from '../middleware/authorization';

const router = express.Router();
const {
  createUserType,
  requireToken,
  adminStaffOnly,
  staffOrAccountsOwner,
  generalUser,
  staffOnly,
  staffAdminEmailOwner
} = authorization;
const {
  getAccounts,
  postAccount,
  accountNumber,
  transaction,
  confirmSufficientBalance,
  validateStatusToggle,
  idNumberType
} = accountValidation;
const { validateSignin, validateSignup, assertEmailExist } = userValidation;
const {
  postCredit,
  postDebit,
  getAllAccounts,
  getAllTransactions,
  getSpecificAccount,
  deleteAccount,
  postAccounts,
  patchAccount,
  getSpecificTransaction
} = accountController;
const { userSignup, getUserAccounts, userSignin } = userController;

router.get('/', (request, response) => {
  response.status(200).send('Welcome to Banka api version 1');
});

// Auth Endpoints
router
  .post('/auth/signup', createUserType, validateSignup, userSignup)
  .post('/auth/signin', validateSignin, userSignin);

// Users Endpoints
router.get(
  '/users/:userEmail/accounts',
  requireToken,
  assertEmailExist,
  staffAdminEmailOwner,
  getUserAccounts
);

// Accounts endpoint
router
  .get('/accounts', requireToken, adminStaffOnly, getAccounts, getAllAccounts)
  .post('/accounts', requireToken, generalUser, postAccount, postAccounts)
  .patch(
    '/accounts/:accountNumber',
    requireToken,
    adminStaffOnly,
    accountNumber,
    validateStatusToggle,
    patchAccount
  )
  .delete(
    '/accounts/:accountNumber',
    requireToken,
    adminStaffOnly,
    accountNumber,
    deleteAccount
  )
  .get(
    '/accounts/:accountNumber',
    requireToken,
    accountNumber,
    staffOrAccountsOwner,
    getSpecificAccount
  )
  .post(
    '/accounts/:accountNumber/debit',
    requireToken,
    staffOnly,
    accountNumber,
    transaction,
    confirmSufficientBalance,
    postDebit
  )
  .post(
    '/accounts/:accountNumber/credit',
    requireToken,
    staffOnly,
    accountNumber,
    transaction,
    postCredit
  )
  .get(
    '/accounts/:accountNumber/transactions',
    requireToken,
    accountNumber,
    staffOrAccountsOwner,
    getAllTransactions
  )
  .get(
    '/accounts/:accountNumber/transactions/:id',
    requireToken,
    accountNumber,
    staffOrAccountsOwner,
    idNumberType,
    getSpecificTransaction
  );

export default router;
