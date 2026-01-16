// Model untuk invoice
const { getConnection } = require('../config/db');

const Invoice = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT i.*, o.total, o.status, t.nama_toko FROM invoice i LEFT JOIN orders o ON i.order_id = o.order_id LEFT JOIN toko t ON o.toko_id = t.toko_id ORDER BY i.invoice_id DESC', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT i.*, o.total, o.status, t.nama_toko FROM invoice i LEFT JOIN orders o ON i.order_id = o.order_id LEFT JOIN toko t ON o.toko_id = t.toko_id WHERE i.invoice_id = ?', [id], callback);
  },
  getByOrderId: (orderId, callback) => {
    const db = getConnection();
    db.query('SELECT i.*, o.total, o.status, t.nama_toko FROM invoice i LEFT JOIN orders o ON i.order_id = o.order_id LEFT JOIN toko t ON o.toko_id = t.toko_id WHERE i.order_id = ?', [orderId], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO invoice (order_id, file_url) VALUES (?, ?)', [data.order_id, data.file_url], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE invoice SET file_url=? WHERE invoice_id=?', [data.file_url, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM invoice WHERE invoice_id=?', [id], callback);
  }
};

module.exports = Invoice;
