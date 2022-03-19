const uuid = require('uuid');
const { validationResult } = require('express-validator');

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
const signup = (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input passed pleasse check your data', 422);
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: uuid.v4(),
    name, // name: name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
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
