//Import Express
const { validationResult } = require('express-validator');

//Mongo:
const UserMongo = require('../models/Schemas/user');

//HTTPERROS
const HttpError = require('../models/http-error');

//Import BCTPY:
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../models/Schemas/mailer');

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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Não foi possivel criar o usuario, tente novamente mais tarde! ',
      500,
    );
    return next(error);
  }

  const createdUser = new UserMongo({
    name,
    lastName,
    email,
    isAdmin: false,
    password: hashedPassword,
    fichas: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' },
    );
  } catch (err) {
    const error = new HttpError(
      'Não foi possivel criar o usuario, tente novamente mais tarde! ',
      500,
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//LOGIN USER WITH EMAIL AND PASSWORD

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserMongo.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError(
      'Não foi possível realizar o login, tente novamente mais tarde',
      500,
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError('Email não encontrado!', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500,
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError('Senha inválida!', 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' },
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500,
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const getUserId = async (req, res, next) => {
  const userID = req.params.userId;
  let valuesUser;
  //GET MONGO DB:
  try {
    valuesUser = await UserMongo.findById(userID, '-password').exec();
  } catch (err) {
    const error = new HttpError('Não há nenhum usuário com esse id ', 500);
    return next(error);
  }

  if (!valuesUser || valuesUser.length === 0) {
    return next(
      new HttpError(
        'Não foi possível encontrar um usuário para o id fornecido !',
        404,
      ),
    );
  }
  res.json(valuesUser);
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserMongo.findOne({ email });

    if (!user) {
      return next(new HttpError('User not found!', 400));
    }
    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await UserMongo.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        //Expira em 1 hora!
        passwordResetExpiress: now,
      },
    });
    const link = `https://tcc-corsi.netlify.app/reset-password/${token}/${user.id}`;

    mailer.sendMail(
      {
        to: email,
        subject: 'Recuperação de senha',
        template: 'auth/templateEmail',
        context: { link },
      },
      (err) => {
        if (err) {
          console.log(err);

          const error = new HttpError('Erro ao recuperar senha', 400);
          return next(error);
        }

        return res.status(200).json({
          message: 'Email enviado com sucesso',
        });
      },
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao recuperar senha.', 400);
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, token, password } = req.body;

  try {
    const user = await UserMongo.findOne({ email }).select(
      '+passwordResetToken passwordResetExpiress',
    );

    if (!user) {
      return next(new HttpError('User not found!', 400));
    }

    if (token !== user.passwordResetToken) {
      return next(new HttpError('Token inválido!', 400));
    }

    const now = new Date();
    if (now > user.passwordResetExpiress) {
      return next(new HttpError('Token Expirado!', 400));
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        'Não foi possivel criar o usuario, tente novamente mais tarde! ',
        500,
      );
      return next(error);
    }

    user.password = hashedPassword;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      message: 'Senha alterada com sucesso',
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao recuperar senha.', 400);
    return next(error);
  }
};

//EXPORT FEATURES
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserId = getUserId;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
