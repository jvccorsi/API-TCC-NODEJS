//Imports
const express = require('express');
const router = express.Router();
const validator = require('express-validator'); //VALIDATOR WITH EXPRESS (MAIS FACIL)

//Export dos controllers (logica da rota)
const fichasControllers = require('../controllers/fichaControllers');

//GET PELO ID !
router.get('/:fichaId', fichasControllers.getFichaById);

//GET PELO ID DO USUARIO !
router.get('/user/:user_id', fichasControllers.getFichasByUserId);

//Post das FICHAS:
router.post('/', fichasControllers.createFicha); //Check verifica o campo "title" não está vazio (PK)

//Update:
router.patch('/:fichaId', fichasControllers.updateFicha);

//Delete:
router.delete('/:fichaId', fichasControllers.deleteFicha);
router.get('/', fichasControllers.getAllFichas);

module.exports = router;

//-----------EXEMPLOS VALIDACAO BACK -----------

// //Update:
// router.patch(
//   '/:fichaId',
//   [
//     validator.check('title').not().isEmpty(),
//     validator.check('description').isLength({ min: 5 }),
//   ],
//   fichasControllers.updateFicha,
// );
//EXEMPLO VALIDACAO:
// //Post das coisas:
// router.post(
//   '/',
//   [
//     validator.check('title').not().isEmpty(),
//     validator.check('description').isLength({ min: 5 }),
//     validator.check('address').not().isEmpty(),
//   ],
//   fichasControllers.createFicha,
// ); //Check verifica o campo "title" não está vazio (PK)
