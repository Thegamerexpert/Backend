const Hospital = require('../models/hospitales');
const Medico = require('../models/medicos');
const Usuario = require('../models/usuario');
const fs = require('fs');

const borrarImagen = async(path)=>{
            
    //Ver info de preproceso
    console.log(fs.existsSync(path));
    console.log(path);
    if (fs.existsSync(path)) {
        //borrar imagen
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo,path) =>{

    let pathViejo = "";

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log("No se encontro por id");
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);           

            medico.img = nombreArchivo;

            //guardar imagen
            await medico.save();            
            return true;

            break;
        case 'hospitales':

            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log("No se encontro por id");
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo,path);           

            hospital.img = nombreArchivo;

            //guardar imagen
            await hospital.save();            
            return true;

            break;
        case 'usuarios':
            
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log("No se encontro por id");
                return false;
            }

            pathViejo = `./uploads/medicos/${usuario.img}`;
            borrarImagen(pathViejo);           

            usuario.img = nombreArchivo;

            //guardar imagen
            await usuario.save();            
            return true;

            break;    
        default:
            break;
    }

}


module.exports = {
    actualizarImagen
}