//Imports
const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator');

//Importação schema mongo (Template place - Olhar o export):
const Place = require('../models/place');

//LOGICA PARA BUSCAR LUGARES PELO ID DO LUGAR
const getPlaceById = async (req, res, next) => {
  //pid -> ID do place.
  const placeID = req.params.places_id; //Vai puxar o ramatro PID da url para pegar o id e dar um selec tno bd

  let place;
  //GET MONGO DB:
  try {
    place = await Place.findById(placeID).exec();
  } catch (error) {
    console.log(error);
  }

  if (!place || place.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided !', 404),
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

//LOGICA PARA BUSCAR LUGARES PELO USER ID
const getPlacesByUserId = async (req, res, next) => {
  const userID = req.params.user_id; //Vai puxar o parametro PID da url para pegar o id e dar um select no bd

  let places;
  //SELECT NO MONGO BUSCANDO O ID DO USER
  try {
    places = await Place.find({ creator: userID });
  } catch (err) {
    console.log(err);
  }

  if (!places || places.length === 0) {
    next(new HttpError('Could not find a place for the provided !', 404));
  } else {
    res.json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  }
};

//POST place WITH MONGODB:
const createPlace = async (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input passed pleasse check your data', 422);
  }
  const { title, description, coordinates, address, creator } = req.body; //Puxar esses campos do body -> POST MONGO
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ place: createdPlace });
};

//Update:

const updatePlace = async (req, res) => {
  const placeID = req.params.places_id; //Vai puxar o ramatro PID da url para pegar o id e dar um selec tno bd
  let place;
  //GET MONGO DB:
  try {
    place = await Place.findById(placeID);
    Object.assign(place, req.body);
    place.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

//Delete:

const deletePlace = async (req, res, next) => {
  const placeId = req.params.places_id;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
  }

  try {
    await place.remove();
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ message: 'Deleted place.' });
};

//EXPORT DAS FEATURES
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
