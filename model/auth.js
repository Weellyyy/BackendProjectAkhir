// Model untuk user/admin
const { getConnection } = require('../config/db');

const Auth = {
  findByUsername: (username, callback) => {
    const db = getConnection();
    db.query('SELECT * FROM users WHERE username = ?', [username], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [data.username, data.password, data.role || 'admin'], callback);
  }
};

module.exports = Auth;
