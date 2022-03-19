//IMPORTS:
const express = require('express');
const bodyParser = require('body-parser');
const placeRouters = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const app = express();
const HttpError = require('./models/http-error');

//POST
app.use(bodyParser.json());

//routes place
app.use('/api/places', placeRouters);
app.use('/api/users', userRoutes);

//Erros para rotas não cadastradas !:
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

//Error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(5000);
