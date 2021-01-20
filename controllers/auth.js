const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const  {email, password} = req.body;    

    try {
        
        /*try {*/
            
            //verificar user
             const usuarioDB = await Usuario.findOne({email});
    
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: "Algo esta mal con el usuario"
                });
            }
            
        /*} catch (error) {
            console.log('Error en el proceso de '+
            'verificación de usuario------------');
            console.log(error);
        }*/

        /*try {  */          
            //verificar contra                                  //de la BD cifrado compara
            const validPassword = bcrypt.compareSync(password, usuarioDB.password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: "Algo esta mal con la contraseña"
                });
            }

        /*} catch (error) {
            console.log('Error en el proceso de '+
            'verificación de contraseña------------');
            console.log(error);
        }*/

        //generar token = JWT
        const token = await generateJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: "Viva el trap y las lolis",
            msg: "la clave: " + token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:"Contacte con el admin"
        });

    }

}

module.exports = {
    login,    
}