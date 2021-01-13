require('dotenv').config();
const mongoose = require('mongoose');


const dbConnect = async () =>{
    try{
        mongoose.connect(process.env.URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true
        });
        
        console.log('Connectado a db correctamente');
        
    } catch(error){
        console.log(error);
        throw new Error('Error al iniciar logs');
    }
    
}

module.exports={
    dbConnect: dbConnect
}