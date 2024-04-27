import express from 'express';
import getTransaccion from './recibir/getTransaccion.js';
import insertarFarmacia from './ConsultaGema/consultasFarmacia.js';
import obtenerPago from './ConsultaGema/obtenerPago.js';

const app = new express();



app.use(getTransaccion);

app.use(insertarFarmacia);

app.use(obtenerPago);






app.listen(8080);
console.log("Server started on port 8080");