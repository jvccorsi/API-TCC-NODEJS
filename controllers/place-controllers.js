//Imports
const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

//LOGICA PARA BUSCAR LUGARES PELO ID DO LUGAR
const getPlaceById = (req, res, next) => {
  //pid -> ID do place.
  const placeID = req.params.places_id; //Vai puxar o ramatro PID da url para pegar o id e dar um selec tno bd
  const place_select = DUMMY_PLACES.find((p) => {
    return p.id === placeID;
  }); //Proura esse ID no array

  if (!place_select) {
    throw new HttpError('Could not find a place for the provided !', 404);
  }

  res.json({ place_select });
};

//LOGICA PARA BUSCAR LUGARES PELO USER ID
const getPlacesByUserId = (req, res, next) => {
  const userID = req.params.user_id; //Vai puxar o ramatro PID da url para pegar o id e dar um selec tno bd
  const places_select = DUMMY_PLACES.filter((p) => {
    return p.creator === userID;
  });
  if (!places_select || places_select.length === 0) {
    next(new HttpError('Could not find a place for the provided !', 404));
  } else {
    res.json({ places_select });
  }
};

//POST place:
const createPlace = (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input passed pleasse check your data', 422);
  }
  const { title, description, coordinates, address, creator } = req.body; //Puxar esses campos do body
  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
};

//Update:

const updatePlace = (req, res, next) => {
  const errors = validationResult(req); //validação do express
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input asdas pleasse check your data', 422);
  }
  const { title, description } = req.body; //Puxar esses campos do body da requisicao
  const placeId = req.params.places_id;
  const updatedPlace = {
    ...DUMMY_PLACES.find((p) => {
      return p.id === placeId;
    }),
  };

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace; //Trocar pelo objeto updatePlaces (no index correto)

  res.status(200).json({ place: updatedPlace });
};

//Delete:

const deletePlace = (req, res, next) => {
  const placeId = req.params.places_id;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
};

//EXPORT DAS FEATURES
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
