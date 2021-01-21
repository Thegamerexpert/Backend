//const { model } = require("mongoose");
const Medico = require('../models/medicos');
const {response} = require('express');
const bcrypt = require('bcryptjs');
//const { userInfo } = require("os");
const {generateJWT} = require('../helpers/jwt');

const getMedicos = async(req,res) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    //busca todos los medicos
    const medicos = await Medico.find({},'nombre email role google img');

    //respuesta servidor
    res.json({
        ok: true,               
        medicos: medicos,
        uid: req.uid        
    });

}

const crearMedico = async(req,res = response) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    const {email, password}= req.body;
    
    try {

        const nuevoMedico = await Medico.findOne({email});

        if (nuevoMedico) {
            return res.status(400).json({
                ok: false,
                msg:"El correo ya existe"
            });
        }

        const medico = new Medico (req.body);

        //encriptar contra
        const salt = bcrypt.genSaltSync();
        medico.password = bcrypt.hashSync(password,salt);

        //guardar medico
        await medico.save();

        //token import
        const token = await generateJWT(medico.id);

        //respuesta servidor
        res.json({
            ok: true,     
            medico: medico,     //solo medico
            msg: "la clave: " + token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error desconocido revisar logs"
        });
    }

    
}

const actualizarMedico = async(req, res = response) => {

    const uid = req.params.header;    

    try {

        const medicoDB = await Medico.findById(uid);
        

        //Comprueba si existe el medico
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: "No tiene la autoridad para modicar otros medicos"
            });
        }

        //Actualizar
        //Crea una constante de la solicitud

        //Extrae los campos solicitados
        const {password,google,email,...campos} = req.body;

        //comprueba si se cambia el email
        if (medicoDB.email !== email) {
            
            const existeEmail = await medico.findOne({email});
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un medico con este email"
                });
            }
        }

        //Especifica el campo
        campos.email = email;

        //Borra los campos solicitados
        /*delete campos.password;
        delete campos.google;*/

        const medicoActualizado = await medico.findByIdAndUpdate(uid,campos,{new: true});

        res.json({
            ok: true,            
            medico: medicoActualizado            
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "error inesperado"
        });

    }

}

const borrarMedico = async(req,res = response) => {
    const uid = req.params.id;        

    try {

        const medicoDB = await medico.findById(uid);        

        //Comprueba si existe el medico
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: "Este medico no existe"
            });
        }

        await medico.findOneAndDelete(uid);

        res.json({
            ok: true,
            msg: "medico borrado",                      

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
    getMedicos,
    actualizarMedico,
    crearMedico,
    borrarMedico
}