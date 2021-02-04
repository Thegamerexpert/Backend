const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const path = require('path');
const fs = require('fs');

const fileUpload = (req,res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //comprobar tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: "El tipo selecionado no es el correcto: medico, hospital, usuario"
        });
    }

    //comprueba si se a cogido algo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No se subio ningun archivo"
        });
    }

    //procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const  extensionArchivo= nombreCortado[nombreCortado.length-1];

    //validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: "El tipo de archivo no esta permitido"
        });
    }

    //generar nombre archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //guardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path,(err) =>{
    if (err){
        console.log(err)
        return res.status(500).json({
            ok: true,
            msg: "error al mover imagen"
        });
    }
    
    //ver imagen 
    console.log(file);
    
    //Actualizar BD
    actualizarImagen(tipo, id, nombreArchivo,path);
    
    //respuesta servidor
    res.json({
        ok: true,
        msg: 'file uploaded: true',
         nombreArchivo
    });

    console.log("subiendo imagen: " + nombreArchivo);
});

}

const mostrarImagen = (req,res = response) => {

    const tipo = req.params.tipo;
    const  foto= req.params.foto;

    //obtener direccion imagen
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    
    //Imagen por defecto
    if (fs.existsSync(pathImg)) {
        console.log("Mostrando imagen encontrada: " + pathImg);
        res.sendFile(pathImg);        
    }else {
        const pathImg = path.join(__dirname, `../uploads/404/ja.jpg`);
        console.log("Mostrando imagen encontrada: " + pathImg);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    mostrarImagen
}