const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnect} =  require('./db/config');
//const port = 3005;

//Crea servidor

const app = express();

app.use(cors());

//lectura y parseo del body
app.use(express.json());

dbConnect();

//muestra el proceso por consola
//console.log(process.env);

app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/login',require('./routes/auth'));

//listo para peticiones
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto: ' + process.env.PORT);
});