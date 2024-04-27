import express from "express";
import connection from "../BD/Connection.js";


const insertarFarmacia = new express();
insertarFarmacia.use(express.json());
insertarFarmacia.use(express.urlencoded({ extended: false }));


insertarFarmacia.post('/mp/insertar', (req, res) => {
    const { store_id, idfarmacia, nombre, token, pos_id, user_id, terminal } = req.body;
    const nombreM = nombre.toLowerCase();
    if (store_id, idfarmacia, nombre, token, pos_id, user_id, terminal === null) return res.sendStatus(400).send('Todos los campos son obligatorios');
    connection.query(`CREATE TABLE IF NOT EXISTS farmacias (store_id VARCHAR(36) PRIMARY KEY,idfarmacia VARCHAR(255),nombre VARCHAR(255),token VARCHAR(255),pos_id VARCHAR(255),user_id VARCHAR(255),terminal VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`, (err, resultTable) => {
        if (err) {
            console.error("Error al crear la tabla:", err);
            res.send("Error al Crear la tabla").status(401);
        } else {
            const sql = `INSERT INTO farmacias (store_id, idfarmacia, nombre, token,pos_id,user_id,terminal) VALUES ('${store_id}', '${idfarmacia}', '${nombreM}', '${token}','${pos_id}','${user_id}','${terminal}')`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error("Error al insertar los datos:", err);
                    if(err.code === 'ER_DUP_ENTRY'){
                        res.send("Error al insertar los datos, ya existe el registro").status(401);
                    }
                    
                    res.send("Error al insertar los datos").status(401);
                }
                else {
                    console.log("Datos insertados");
                    res.send("Datos insertados").status(200);
                }
            });
        }
    });
});



insertarFarmacia.get('/mp/obtener/:codigofarmacia', (req, res) => {
    const { codigofarmacia } = req.params;
    if (codigofarmacia === null) return res.sendStatus(400).send('Todos los campos son obligatorios');
    connection.query('SELECT * FROM farmacias where' + codigofarmacia, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

export default insertarFarmacia;