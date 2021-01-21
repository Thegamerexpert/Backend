/*
Ruta /api/usuarios
*/

const {Router}= require('express');
const {getHospitales,crearHospitales,actualizarHostpitales,borrarHospitales} = require('../controllers/hospitales');
const {check} = require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar.jwt');

const router = Router();

//res response server
router.get('/',validarJWT, getHospitales);

//crear
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),    
    check('calle','La calle es obligatoria').not().isEmpty(), 
    validarCampos,   
],crearHospitales);

//actualizar
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('calle','La calle es obligatorio').not().isEmpty()/*
    check('role','El role es obligatorio').not().isEmpty()*/,
    validarCampos,
    ],actualizarHostpitales);

//borrar
router.delete('/:id',[
    validarJWT,    
    validarCampos,   
],borrarHospitales);

module.exports = router;