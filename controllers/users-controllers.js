const uuid = require('uuid');
const { validationResult } = require('express-validator');

//Mongo:
const UserMongo = require('../models/Schemas/user');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
];

//GET ALL USERS
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

//CADASTRAR USUARIO
const signup = async (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed pleasse check your data', 422),
    );
  }
  //COMEÇO ->
  const { name, email, password, places } = req.body;
  let existingUser;
  try {
    existingUser = await UserMongo.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    const error = new HttpError('User já existe', 422);
    return next(error);
  }

  const createdUser = new UserMongo({
    name,
    email,
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email); //BUSCA O REGISTRO NO EMAIL INFORMADO
  if (!identifiedUser || identifiedUser.password !== password) {
    //SE A SENHA NAO BATER PARA O EMAIL INFORMADO, EXIBE O ERRO.
    throw new HttpError(
      'Could not identify user, credentials seem to be wrong.',
      401,
    );
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
