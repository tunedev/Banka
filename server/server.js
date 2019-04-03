import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

const app = express();

// setting port to env's port and when not available to 3000
const port = process.env.PORT || 3000;

// Middlewares
// logs request info for easy tracking
app.use(logger('dev'));

// Set up body parser in order to access json and urlencoded values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

export default app;
