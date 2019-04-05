import express from 'express';

import validateSignup from '../middleware/validate/user.validate';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', validateSignup, userController.userSignup);

export default router;
