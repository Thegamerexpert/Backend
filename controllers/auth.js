const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');

const login = async(req, res = response) => {

    const  {email, password} = req.body;    

    try {             
            
            //verificar user
             const usuarioDB = await Usuario.findOne({email});
    
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: "Algo esta mal con el usuario"
                });
            }

                 
            //verificar contra                                  //de la BD cifrado compara
            const validPassword = bcrypt.compareSync(password, usuarioDB.password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: "Algo esta mal con la contraseña"
                });
            }        

        //generar token = JWT
        const token = await generateJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: "Viva el trap y las lolis",
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:"Contacte con el admin"
        });

    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    //generar token = JWT
    const token = await generateJWT(uid);

    res.json({
        ok: true,
        uid:  uid,
        token
    });
}

module.exports = {
    login,    
    renewToken
}