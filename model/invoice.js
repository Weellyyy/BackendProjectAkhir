// Model untuk invoice
const { getConnection } = require('../config/db');

const Invoice = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT * FROM invoice', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT * FROM invoice WHERE invoice_id = ?', [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO invoice (order_id, file_url) VALUES (?, ?)', [data.order_id, data.file_url], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM invoice WHERE invoice_id=?', [id], callback);
  }
};

module.exports = Invoice;
