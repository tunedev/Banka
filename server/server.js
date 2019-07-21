import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotEnv from 'dotenv';
import cors from 'cors';
import swagger from 'swagger-ui-express';
import swaggerDocument from './documentation/swagger.json';

// Import routes
import routes from './routes/router';

const app = express();

dotEnv.config();

// setting port to env's port and when not available to 3000
const port = process.env.PORT || 3000;

// Middlewares
// logs request info for easy tracking
app.use(cors())
app.use(logger('dev'));

// Set up body parser in order to access json and urlencoded values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up all routes
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Banka app'
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Specified endpoint does not exist yet'
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    status: 500,
    err: 'Something broke'
  });
});

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

export default app;
