import express from 'express';

import accountController from '../controllers/accounts';
import accountValidation from '../middleware/validate/account';

const router = express.Router();

router.post('/', accountValidation.postAccount, accountController.postAccount);
router.patch('/:accountNumber', accountValidation.patchAccount, accountController.patchAccount);

export default router;
