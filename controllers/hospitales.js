//const { model } = require("mongoose");
const Hospital = require('../models/hospitales');
const {response} = require('express');
const bcrypt = require('bcryptjs');
//const { userInfo } = require("os");
const {generateJWT} = require('../helpers/jwt');

const getHospitales = async(req,res) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    //busca todos los Hospitales
    const hospitales = await Hospital.find({},'nombre calle img google');

    //respuesta servidor
    res.json({
        ok: true,               
        hospitales: hospitales,
        img: req.img,
        uid: req.uid        
    });

}

const crearHospitales = async(req,res = response) =>{

    //Muestra solicitud cliente
    console.log(req.body);

    const {calle, password, img}= req.body;
    
    try {

        const nuevoHospital = await Hospital.findOne({calle});

        if (nuevoHospital) {
            return res.status(400).json({
                ok: false,
                msg:"La calle ya existe"
            });
        }

        const hospital = new Hospital (req.body);

        //encriptar contra
        const salt = bcrypt.genSaltSync();
        hospital.password = bcrypt.hashSync(password,salt);

        //guardar Hospital
        await hospital.save();

        //token import
        const token = await generateJWT(hospital.id);

        //respuesta servidor
        res.json({
            ok: true,     
            hospital: hospital,     //solo hospital
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

const actualizarHostpitales = async(req, res = response) => {

    const uid = req.params.header;    

    try {

        const hospitalDB = await Hospital.findById(uid);
        

        //Comprueba si existe el hospital
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: "No tiene la autoridad para modificar otros hospitales"
            });
        }

        //Actualizar
        //Crea una constante de la solicitud

        //Extrae los campos solicitados
        const {password,google,calle,...campos} = req.body;

        //comprueba si se cambia el email
        if (hospitalDB.calle !== calle) {
            
            const existeCalle = await hospital.findOne({calle});
            if (existeCalle) {
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un hospital con esta calle"
                });
            }
        }

        //Especifica el campo
        campos.calle = calle;

        //Borra los campos solicitados
        /*delete campos.password;
        delete campos.google;*/

        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid,campos,{new: true});

        res.json({
            ok: true,            
            hospital: hospitalActualizado            
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "error inesperado"
        });

    }

}

const borrarHospitales = async(req,res = response) => {
    const uid = req.params.id;        

    try {

        const hospitalDB = await Hospital.findById(uid);        

        //Comprueba si existe el hospital
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: "Este hospital no existe"
            });
        }

        await Hospital.findOneAndDelete(uid);

        res.json({
            ok: true,
            msg: "hospital borrado",                      

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
    getHospitales,
    actualizarHostpitales,
    crearHospitales,
    borrarHospitales
}