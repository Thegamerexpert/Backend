const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    
    //leer token
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            ok:false,
            msg: "Sin token na de nanai"
        });
    }

    try {

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        console.log("el usuario con la id: "+uid+" se ha conectado");
        req.uid = uid;
        
        next();

    } catch (error) {
        console.log("Un individuo trato de conectarse con: "+req.header('x-token'));
        return res.status(401).json({
            ok: false,
            msg: "Token incorrecto"
        });
    }


    
}

module.exports = {
    validarJWT
}