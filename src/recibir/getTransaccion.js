import { MercadoPagoConfig, Payment } from "mercadopago";
import express from "express";
import connection from "../BD/Connection.js";


const getTransaccion = new express();
getTransaccion.use(express.json());
getTransaccion.use(express.urlencoded({ extended: false }));


getTransaccion.post('/mp/webhook', (req, res) => {
    console.log(req.query);
    console.log(req.body.store_id);
    connection.query('select * from mp.farmacias where store_id = ' + req.body.store_id, (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length > 0) {
            console.log(result[0].token);
            new MercadoPagoConfig({
                access_token: result[0].token, // Reemplaza esto con tu access_token real
            });
            connection.query('CREATE TABLE IF NOT EXISTS ' + 'payments_' + result.nombre + ' (id VARCHAR(36) PRIMARY KEY,external_reference VARCHAR(255),amount INT,caller_id INT,client_id BIGINT,created_at DATETIME,payment_id INT,payment_state VARCHAR(255),state VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;', (err, resultTable) => {
                if (err) {
                    console.error("Error al crear la tabla:", err);
                    res.send("Error al Crear la tabla").status(401);
                } else {
                    if (req.query.type === 'payment') {
                        let now = new Date();
                        console.log("--------------------");
                        console.log(req.body.action);
                        console.log(req.body.data.id);
                        console.log(now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
                        console.log(req.body.id);
                        console.log("--------------------");
                        res.send('CREATED').status(201);

                    } else if (req.query.type === 'merchant_order') {
                        console.log("--------------------");
                        console.log(req.body);
                        console.log("--------------------");

                        connection.query('CREATE TABLE IF NOT EXISTS pagos (id VARCHAR(36) PRIMARY KEY,external_reference VARCHAR(255),amount INT,caller_id INT,client_id BIGINT,created_at DATETIME,payment_id INT,payment_state VARCHAR(255),state VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;', (err, resultTable) => {
                            if (err) {
                                console.error("Error al crear la tabla:", err);
                                res.send("Error al Crear la tabla").status(401);
                            } else {
                                console.log("Tabla Creada");

                                // Inserción o actualización de datos en la tabla
                                const sqlQuery = ` 
                                INSERT INTO pagos (id, external_reference, amount, caller_id, client_id, created_at, payment_id, payment_state, state)
                                VALUES ('${req.body.id}', '${req.body.external_reference}', '${req.body.amount}', '${req.body.caller_id}','${req.body.client_id}','${req.body.created_at}','${req.body.payment.id}','${req.body.payment.type}','${req.body.state}')
                                ON DUPLICATE KEY UPDATE
                                external_reference = VALUES(external_reference),
                                amount = VALUES(amount),
                                caller_id = VALUES(caller_id),
                                client_id = VALUES(client_id),
                                created_at = VALUES(created_at),
                                payment_state = VALUES(payment_state),
                                state = VALUES(state)

                                `;
                            }
                        });

                        res.send('OK').status(200);
                    }
                    else if (req.query.type === 'point_integration_wh') {
                        connection.query('CREATE TABLE IF NOT EXISTS pagos (id VARCHAR(36) PRIMARY KEY,external_reference VARCHAR(255),amount INT,caller_id INT,client_id BIGINT,created_at DATETIME,payment_id INT,payment_state VARCHAR(255),state VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;', (err, resultTable) => {
                            if (err) {
                                console.error("Error al crear la tabla:", err);
                                res.send("Error al Crear la tabla").status(401);
                            } else {
                                let now = new Date();

                                console.log(now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

                                // Inserción o actualización de datos en la tabla
                                const sqlQuery = `
                                INSERT INTO pagos (id, external_reference, amount, caller_id, client_id, created_at, payment_id, payment_state, state)
                                VALUES ('${req.body.id}', '${req.body.additional_info.external_reference}', '${req.body.amount}', '${req.body.caller_id}','${req.body.client_id}','${req.body.created_at}','${req.body.payment.id}','${req.body.payment.state}','${req.body.state}')
                                ON DUPLICATE KEY UPDATE
                                external_reference = VALUES(external_reference),
                                amount = VALUES(amount),
                                caller_id = VALUES(caller_id),
                                client_id = VALUES(client_id),
                                created_at = VALUES(created_at),
                                payment_state = VALUES(payment_state),
                                state = VALUES(state)
                                `;

                                connection.query(sqlQuery, (err, resultInsert) => {
                                    if (err) {
                                        console.error("Error al insertar o actualizar datos:", err);
                                        res.send('Error al insertar o actualizar datos').status(401);
                                    } else {
                                        res.send('OK').status(200);
                                    }
                                });

                            };
                        });
                    }
                    else if (req.query.topic === 'point_integration_ipn') {
                        connection.query('CREATE TABLE IF NOT EXISTS pagos (id VARCHAR(36) PRIMARY KEY,external_reference VARCHAR(255),amount INT,caller_id INT,client_id BIGINT,created_at DATETIME,payment_id INT,payment_state VARCHAR(255),payment_type VARCHAR(255),state VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;', (err, resultTable) => {
                            if (err) {
                                console.error("Error al crear la tabla:", err);
                                res.send("Error al Crear la tabla").status(401);
                            } else {
                                console.log("Tabla Creada");
                                let now = new Date();

                                console.log(now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
                                // Inserción o actualización de datos en la tabla
                                const sqlQuery = `
                                INSERT INTO pagos (id, external_reference, amount, caller_id, client_id, created_at, payment_id, payment_state, state, payment_type)
                                VALUES ('${req.body.id}', '${req.body.additional_info.external_reference}', '${req.body.amount}', '${req.body.caller_id}','${req.body.client_id}','${req.body.created_at}','${req.body.payment.id}','${req.body.payment.state}','${req.body.state}','${req.body.payment.type}')
                                ON DUPLICATE KEY UPDATE
                                external_reference = VALUES(external_reference),
                                amount = VALUES(amount),
                                caller_id = VALUES(caller_id),
                                client_id = VALUES(client_id),
                                created_at = VALUES(created_at),
                                payment_state = VALUES(payment_state),
                                state = VALUES(state)
                                `;


                                connection.query(sqlQuery, (err, resultInsert) => {
                                    if (err) {
                                        console.error("Error al insertar o actualizar datos:", err);
                                        res.send('Error al insertar o actualizar datos').status(401);
                                    } else {
                                        res.send('OK').status(200);
                                    }
                                });


                            };

                        });

                    }
                    else if (req.query.type === 'test') {
                        res.send('OK').status(200);
                    }

                }
            }
            );
        }
    });

});
export default getTransaccion;