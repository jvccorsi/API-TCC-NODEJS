//Import Express
const { validationResult } = require('express-validator');

//Mongo:
const UserMongo = require('../models/Schemas/user');

//HTTPERROS
const HttpError = require('../models/http-error');

//GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await UserMongo.find({}, '-password'); //Tirar o password do get all
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500,
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//CADASTRAR USUARIO
const signup = async (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    return next(new HttpError('Os dados informados estão incorretos', 422));
  }

  const { name, email, password, lastName } = req.body;
  let existingUser;
  try {
    existingUser = await UserMongo.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Failed, try again', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      'Usuário com o email informado já existe!',
      422,
    );
    return next(error);
  }

  const createdUser = new UserMongo({
    name,
    lastName,
    email,
    password,
    fichas: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

//LOGIN USER WITH EMAIL AND PASSWORD

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    existingUser = await UserMongo.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Não foi possível realizar o login, tente novamente mais tarde',
      500,
    );
    return next(error);
  }
  if (!existingUser || existingUser.password != password) {
    const error = new HttpError(
      'Seu email ou senha está incorreto, tente novamente !',
      401,
    );
    return next(error);
  }
  res.json({ message: 'Logged in!' });
};

//EXPORT FEATURES
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
