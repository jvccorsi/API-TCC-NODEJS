//Imports
const express = require('express');
const router = express.Router();
const validator = require('express-validator'); //VALIDATOR WITH EXPRESS (MAIS FACIL)

//Export dos controllers (logica da rota)
const placesControllers = require('../controllers/place-controllers');

//GET PELO ID !
router.get('/:places_id', placesControllers.getPlaceById);

//GetAll
router.get('/', placesControllers.getPlacesAll);

//GET PELO ID DO USUARIO !
router.get('/user/:user_id', placesControllers.getPlacesByUserId);

//Post das coisas:
router.post(
  '/',
  [
    validator.check('title').not().isEmpty(),
    validator.check('description').isLength({ min: 5 }),
    validator.check('address').not().isEmpty(),
  ],
  placesControllers.createPlace,
); //Check verifica o campo "title" não está vazio (PK)

//Update:
router.patch(
  '/:places_id',
  [
    validator.check('title').not().isEmpty(),
    validator.check('description').isLength({ min: 5 }),
  ],
  placesControllers.updatePlace,
);

//Delete:
router.delete('/:places_id', placesControllers.deletePlace);

module.exports = router;
