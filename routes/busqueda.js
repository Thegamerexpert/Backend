/*
    ruta: api/todo/:busqueda
*/

const {Router}= require('express');
const {getTodo,getEspecifico,} = require('../controllers/busqueda');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar.jwt');

const router = Router();

//busqueda
router.get('/:search',validarJWT,getTodo,validarCampos);
router.get('/coleccion/:tabla/:search',validarJWT,getEspecifico,validarCampos);

module.exports = router;