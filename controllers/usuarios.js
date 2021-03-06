require('dotenv').config();
//const { model } = require("mongoose");
const Usuario = require('../models/usuario');
const {response} = require('express');
const bcrypt = require('bcryptjs');
//const { userInfo } = require("os");
const {generateJWT} = require('../helpers/jwt');

const getUsuarios = async(req,res) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    //Paginacion
    const desde = Number(req.query.desde) || 0;
    //Limite de resultados
        //NUmber requerido para reconocerlo como numero
    const limite = Number(process.env.LIMITERESULTADO);
    //console.log(desde);
    
    //Metodo lento dependiendo de cantidad de registros en bd
    //Total de registros
    //const total = await  Usuario.count();
    
    //busca todos los usuarios
    //const usuarios = await Usuario.find({},'nombre email role google img')
    //.skip(desde).limit(limite);
    
    const [usuarios, total] = await Promise.all([
        Usuario.find({},'nombre email role google img').skip(desde).limit(limite),
        Usuario.count()       
    ]);

    //respuesta servidor
    res.json({
        ok: true,               
        usuarios: usuarios,
        total: total,
        uid: req.uid,                      
    });

}

const crearUsuario = async(req,res = response) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    const {email, password}= req.body;
    
    try {

        const nuevoUsuario = await Usuario.findOne({email});

        if (nuevoUsuario) {
            return res.status(400).json({
                ok: false,
                msg:"El correo ya existe"
            });
        }

        const usuario = new Usuario (req.body);

        //encriptar contra
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        //guardar usario
        await usuario.save();

        //token import
        const token = await generateJWT(usuario.id);

        //respuesta servidor
        res.json({
            ok: true,     
            usuario: usuario,     //solo usuario
            token
        });
        console.log("Se creo el usuario:")

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error desconocido revisar logs"
        });
    }

    
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;        

    try {

        const usuarioDB = await Usuario.findById(uid);
        

        //Comprueba si existe el usuario
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se pudo obtener el usuario, parece que no existe"
            });
        }

        //Actualizar
        //Crea una constante de la solicitud

        //Extrae los campos solicitados
        const {password,google,email,...campos} = req.body;

        //comprueba si se cambia el email
        if (usuarioDB.email !== email) {
            
            const existeEmail = await Usuario.findOne({email});
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con este email"
                });
            }
        }

        //Especifica el campo
        campos.email = email;

        //Borra los campos solicitados
        /*delete campos.password;
        delete campos.google;*/

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new: true});

        console.log("El usuario: "+uid+" Actualizo a: "+usuarioActualizado);
        res.json({
            ok: true,            
            usuario: usuarioActualizado            
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "error inesperado"
        });

    }

}

const borrarUsuario = async(req,res = response) => {
    const uid = req.params.id;        

    try {

        const usuarioDB = await Usuario.findById(uid);        

        //Comprueba si existe el usuario
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Este usuario no existe"
            });
        }

        await Usuario.findOneAndDelete(uid);

        res.json({
            ok: true,
            msg: "usuario borrado",                      

        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al borrar"
        });
    }
}

module.exports={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}