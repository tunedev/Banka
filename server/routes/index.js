import express from 'express';

import userRoutes from './user';
import accountsRoutes from './account';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to Banka api version 1');
});

router.use('/auth', userRoutes);
router.use('/accounts', accountsRoutes);

export default router;
