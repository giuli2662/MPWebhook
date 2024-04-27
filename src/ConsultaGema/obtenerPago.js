import { MercadoPagoConfig, Payment } from "mercadopago";
import express from "express";
import connection from "../BD/Connection.js";


const obtenerPago = new express();
obtenerPago.use(express.json());
obtenerPago.use(express.urlencoded({ extended: false }));


obtenerPago.get('/checkout/:id', async (req, res) => {
    const { id } = req.params;
    try {
        connection.query(`SELECT * FROM mp.pagos WHERE external_reference = '${id}' ORDER BY created_at DESC`, (err, result) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).send('Error interno del servidor');
            } else {
                if (result.length === 0) {
                    res.status(401).send('No existe el pago');
                } else {
                    res.send(JSON.stringify(result)).status(200);
                }
            }
        });
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default obtenerPago;