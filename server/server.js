import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotEnv from 'dotenv';

// Import routes
import userRoutes from './routes/users';
import accountsRoutes from './routes/accounts';

const app = express();

dotEnv.config();

// setting port to env's port and when not available to 3000
const port = process.env.PORT || 3000;

// Middlewares
// logs request info for easy tracking
app.use(logger('dev'));

// Set up body parser in order to access json and urlencoded values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up all routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/accounts', accountsRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Banka server');
});

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

export default app;
