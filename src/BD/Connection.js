import mysql from 'mysql';
import 'dotenv/config';
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {throw err;}else{ console.log('Conectado a la base de datos'); connection.query('select * from mp.farmacias', (err,res) => {if(err){connection.query('CREATE TABLE IF NOT exists `farmacias` (`id` int(11) NOT NULL AUTO_INCREMENT,`store_id` varchar(100) NOT NULL,`idfarmacia` varchar(100) NOT NULL,`nombre` varchar(100) NOT NULL,`token` varchar(100) NOT NULL,`pos_id` varchar(100) NOT NULL,`user_id` varchar(100) NOT NULL,`terminal` varchar(50) NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `unique_pos_id` (`pos_id`),KEY `terminal` (`terminal`)) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;', (err, result) => { if (err) throw err; console.log(result); })}else{console.log('La Tabla existe')}})   ;}

});

export default connection;
