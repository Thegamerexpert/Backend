require('dotenv').config();
const mongoose = require('mongoose');

/*
const user='mean_user';
const passwd='AAAA';
const url = 'mongodb+srv://'+user+':'+passwd+'@cluster0.ctjcn.mongodb.net/test';
*/

const dbConnect = async () =>{
    try{
        mongoose.connect(process.env.URL, { 
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