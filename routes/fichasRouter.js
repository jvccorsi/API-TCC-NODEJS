//Imports
const express = require('express');
const router = express.Router();
const validator = require('express-validator'); //VALIDATOR WITH EXPRESS (MAIS FACIL)
const checkAuth = require('../middleware/check-auth');
//Export dos controllers (logica da rota)
const fichasControllers = require('../controllers/fichaControllers');

//GET PELO ID !
router.get('/:fichaId', fichasControllers.getFichaById);

//GET PELO ID DO USUARIO !
router.get('/user/:user_id', fichasControllers.getFichasByUserId);
router.get('/', fichasControllers.getAllFichas);

router.use(checkAuth);

//Post das FICHAS:
router.post('/', fichasControllers.createFicha); //Check verifica o campo "title" não está vazio (PK)

//Update:
router.patch('/:fichaId', fichasControllers.updateFicha);

//Delete:
router.delete('/:fichaId', fichasControllers.deleteFicha);

module.exports = router;
