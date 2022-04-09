//IMPORTS:
const express = require('express');
const router = express.Router();
const validator = require('express-validator'); //VALIDATOR WITH EXPRESS (MAIS FACIL)

//Export dos controllers (logica da rota)
const usersController = require('../controllers/users-controllers');

//GET PELO ID !
router.get('/', usersController.getUsers);

//Cadastro de usuario
router.post(
  '/signup',
  [
    validator.check('name').not().isEmpty(), //Validacao com express
    validator.check('email').normalizeEmail().isEmail(),
    validator.check('password').not().isEmpty(),
  ],
  usersController.signup,
);

router.post('/login', usersController.login);

module.exports = router;
