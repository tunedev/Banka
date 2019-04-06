import express from 'express';

import { validateSignup, validateSignin } from '../middleware/validate/user.validate';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', validateSignup, userController.userSignup);
router.post('/signin', validateSignin, userController.userSignin);

export default router;
