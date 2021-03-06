//IMPORTS:
const express = require('express');
const bodyParser = require('body-parser');
const fichaRouters = require('./routes/fichasRouter');
const userRoutes = require('./routes/users-routes');
const app = express();
const HttpError = require('./models/http-error');

//DEPLOY HEROKU:
require('dotenv').config();

//MongoConfig:
const mongoose = require('mongoose');

//POST
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//routes
app.use('/api/fichas', fichaRouters);
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

//Conexão mongo:
mongoose
  .connect(
    'mongodb+srv://jvccorsi:jvccorsi145@tcc.rlst9.mongodb.net/DatabaseTcc?retryWrites=true&w=majority',
  )

  .then(() => {
    app.listen(process.env.PORT || 3000, function () {
      console.log('Server status: OK');
    });
  })
  .catch((error) => {
    console.log(error);
  });
