/*
    ruta: api/upload/
*/

const {Router}= require('express');
const {fileUpload,mostrarImagen}  = require('../controllers/uploads');
const {validarJWT} = require('../middlewares/validar.jwt');
const expressfileUpload = require('express-fileupload');

const router = Router();
router.use(expressfileUpload());


//busqueda
router.put('/:tipo/:id',validarJWT,fileUpload);
router.get('/:tipo/:foto',mostrarImagen);

module.exports = router;