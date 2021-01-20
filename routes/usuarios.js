/*
Ruta /api/usuarios
*/

const {Router}= require('express');
const {getUsuarios,crearUsuario,actualizarUsuario,borrarUsuario} = require('../controllers/usuarios');
const {check} = require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar.jwt');

const router = Router();

//res response server
router.get('/',validarJWT, getUsuarios);

//crear
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(), 
    validarCampos,   
],crearUsuario);

//actualizar
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail()/*
    check('role','El role es obligatorio').not().isEmpty()*/,
    validarCampos,
    ],actualizarUsuario);

router.delete('/:id',[
    validarJWT,    
    validarCampos,   
],borrarUsuario);

module.exports = router;