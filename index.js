const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnect} =  require('./db/config');

//Crea servidor

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cors());

dbConnect();

//console.log(process.env);

//req request client
//res response server
app.post('/', (req,res) =>{

    console.log(req.body)

    res.json({
        ok: true,
        msg: 'hola mundo'
    });

});

//listo para peticiones
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto: ' + process.env.PORT);
});