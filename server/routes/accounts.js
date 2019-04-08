import express from 'express';

import accountController from '../controllers/accounts';
import accountValidation from '../middleware/validate/account';

const router = express.Router();

router.post('/', accountValidation.postAccount, accountController.postAccount);
router.patch('/:accountNumber', accountValidation.accountNumber, accountController.patchAccount);
router.delete('/:accountNumber', accountValidation.accountNumber, accountController.deleteAccount);

export default router;
