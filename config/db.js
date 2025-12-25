const mysql = require('mysql2');
require('dotenv').config();

let connection;

function getConnection() {
	if (!connection) {
		connection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			port: process.env.DB_PORT || 3306
		});
		connection.connect((err) => {
			if (err) {
				console.error('Gagal terkoenksi ke database:', err.stack);
				return;
			}
			console.log('Terhubung ke database.');
		});
	}
	return connection;
}

module.exports = { getConnection };
