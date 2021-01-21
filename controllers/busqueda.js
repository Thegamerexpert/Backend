const {response} = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospitales');

const getTodo = async(req, res = response) => {
    
    const Buscqueda = req.params.search;
    const regex = new RegExp( Buscqueda, 'i');

    try {
        
        const [usuarios, medicos, hospitalas] = await Promise.all([
            
            Usuario.find({ nombre: regex}),
            Medico.find({ nombre: regex}),
            Hospital.find({ nombre: regex}),
            
        ]);

        if (!usuarios) {
            res.status(404).tojson({
                ok: true,
                msg: "No se encontro ningun usuario con ese nombre"
            });
        }

        console.log("Se realizo una busqueda con: "+Buscqueda);
        res.json({
            ok: true,            
            Buscqueda: Buscqueda,
            usuarios: usuarios,
            medicos: medicos,
            hospitalas: hospitalas
        });

    } catch (error) {
        console.log(error);
        res.status(501).tojson({
            ok: false,
            msg: "Error inesperado"
        });
    }
}

const getEspecifico = async(req,res = response) => {

    const tabla = req.params.tabla;
    const Buscqueda = req.params.search;
    const regex = new RegExp( Buscqueda, 'i');

    let resultado =  [];
/*  .populate('usuario','nombre img');
resultados especificos
*/

    try {
    switch (tabla) {
        case 'medicos':
            resultado = Medico.find({nombre: regex});
            //console.log("Se realizo una busqueda con: "+Buscqueda);

            break;
        case 'hospitales':
            resultado = Hospital.find({nombre: regex});   
            //console.log("Se realizo una busqueda con: "+Buscqueda);

            break;
        case 'usuarios':
            resultado = Usuario.find({nombre: regex});
            //console.log("Se realizo una busqueda con: "+Buscqueda);
            
            break;
    
            default:
            //console.log("Se realizo una busqueda con: "+Buscqueda);
            return res.status(400).json({
                ok: false,
                msg: "La tabla debe de ser medicos, hospitales o usuarios"
            });                        
            
            res.json({
                ok: true,
                resultados: resultado
            });
                
    }


}catch(error){

    console.log(error);
    res.status(404).json({
        ok: true,
        msg: "No se encontraron coincidencias"
    });
}
/*
    try {
        
        const usuarios = await Usuario.find({ nombre: regex});

        if (!usuarios) {
            res.status(404).tojson({
                ok: true,
                msg: "No se encontro ningun usuario con ese nombre"
            });
        }

        console.log("Se realizo una busqueda con: "+Buscqueda);
        res.json({
            ok: true,            
            Buscqueda: Buscqueda,
            usuarios: usuarios
        });

    } catch (error) {
        console.log(error);
        res.status(501).tojson({
            ok: false,
            msg: "Error inesperado"
        });
    }*/

}

module.exports = {
    getTodo,
    getEspecifico,    
}