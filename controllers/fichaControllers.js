//Imports
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

//Importação schema mongo
const Ficha = require('../models/Schemas/fichas');
const User = require('../models/Schemas/user');
const { default: mongoose } = require('mongoose');

//LOGICA PARA BUSCAR fichas PELO ID DO LUGAR
const getFichaById = async (req, res, next) => {
  const fichaID = req.params.fichaId;
  let defaultValues;
  //GET MONGO DB:
  try {
    defaultValues = await Ficha.findById(fichaID).exec();
  } catch (err) {
    const error = new HttpError('Não há nenhuma ficha com esse id ', 500);
    return next(error);
  }

  if (!defaultValues || defaultValues.length === 0) {
    return next(
      new HttpError(
        'Não foi possível encontrar uma ficha para o id fornecido !',
        404,
      ),
    );
  }
  res.json({ defaultValues: defaultValues.toObject({ getters: true }) });
};

//LOGICA PARA BUSCAR Fichas DE ACORDO COM O USER ID
const getFichasByUserId = async (req, res, next) => {
  const userID = req.params.user_id;

  let fichas;
  //SELECT NO MONGO BUSCANDO O ID DO USER
  try {
    fichas = await Ficha.find({ creator: userID });
  } catch (err) {
    const error = new HttpError(
      'Erro ao realizar a busca, tente novamente depois',
      500,
    );
    return next(error);
  }

  if (!fichas || fichas.length === 0) {
    next(
      new HttpError(
        'Não foi possível encontrar uma ficha para o id fornecido !',
        404,
      ),
    );
  } else {
    res.json({
      fichas: fichas.map((ficha) => ficha.toObject({ getters: true })),
    });
  }
};

//POST FICHAS COM MONGODB:
const createFicha = async (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed pleasse check your data', 422),
    );
  }
  const {
    creator,
    atendimento,
    solicitante,
    paciente,
    agenteToxico,
    exposicao,
    outrasInformacoes,
    acompanhamento,
    classificacaoFinal,
  } = req.body; //Puxar esses campos do body -> POST MONGO
  const createFicha = new Ficha({
    creator,
    atendimento: atendimento, //É UM OBJETO !
    solicitante: solicitante, //É UM OBJETO !
    paciente: paciente, //É UM OBJETO !
    agenteToxico: agenteToxico, //É UM OBJETO !
    exposicao: exposicao, //É UM OBJETO !
    outrasInformacoes: outrasInformacoes, //É UM OBJETO !
    acompanhamento: acompanhamento, //É UM OBJETO !
    classificacaoFinal: classificacaoFinal, //É UM OBJETO !
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Não foi possível encontrar uma ficha para o id fornecido !',
      500,
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      'Não foi possível usuario com o id fornecido ',
      404,
    );
    return next(error);
  }

  try {
    const session_start = await mongoose.startSession();
    session_start.startTransaction();
    await createFicha.save({ session: session_start });
    user.fichas.push(createFicha);
    await user.save({ session: session_start, validateModifiedOnly: true });
    session_start.commitTransaction();
  } catch (err) {
    const error = new HttpError('Não foi possivel realizar o cadastro', 404);
    return next(error);
  }

  res.status(201).json({ ficha: createFicha });
};

//Update FICHA COM MONGODB:
const updateFicha = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const fichaID = req.params.fichaId;
  let ficha;
  //GET MONGO DB:
  try {
    ficha = await Ficha.findById(fichaID);

    Object.assign(ficha, req.body);
    ficha.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Algo de errado aconteceu, não foi possível atualizar a ficha',
      500,
    );
    return next(error);
  }

  res.json({ ficha: ficha.toObject({ getters: true }) });
};

//Delete FICHA COM MONGO DB:
const deleteFicha = async (req, res, next) => {
  const fichaID = req.params.fichaId;

  let ficha;

  try {
    ficha = await Ficha.findById(fichaID).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Algo de errado aconteceu, não foi possível deletar a ficha',
      500,
    );
    return next(error);
  }

  //Se não encontrar um lugar com o id indicado
  if (!ficha) {
    const error = new HttpError('Não há ficha para o id fornecido', 400);
    return next(error);
  }

  try {
    const session_start = await mongoose.startSession();
    session_start.startTransaction();
    await ficha.remove({ session: session_start });
    await ficha.creator.fichas.pull(ficha);
    await ficha.creator.save({
      session: session_start,
      validateModifiedOnly: true,
    });
    await session_start.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Ocorreu algum erro na hora de deletar', 400);
    return next(error);
  }
  res.status(200).json({ message: 'Deleted ficha.' });
};

//GET ALL Fichas
const getAllFichas = async (req, res, next) => {
  let ficha;
  try {
    ficha = await Ficha.find({}).select({
      atendimento: 1,
      paciente: 1,
      solicitante: 1,
    }); //Tirar o password do get all
  } catch (err) {
    const error = new HttpError('Erro, tente novamente depois!', 500);
    return next(error);
  }
  res.json(ficha);
};

//EXPORT DAS FEATURES
exports.getFichaById = getFichaById;
exports.getFichasByUserId = getFichasByUserId;
exports.createFicha = createFicha;
exports.updateFicha = updateFicha;
exports.deleteFicha = deleteFicha;
exports.getAllFichas = getAllFichas;
