import express from 'express';

import accountController from '../controllers/accounts';
import accountValidation from '../middleware/validate/account';

const router = express.Router();

router.post('/', accountValidation.postAccount, accountController.postAccount);

export default router;
