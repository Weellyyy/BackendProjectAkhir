// Model untuk order
const { getConnection } = require('../config/db');

const Order = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT * FROM orders', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT * FROM orders WHERE order_id = ?', [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO orders (toko_id, total, status) VALUES (?, ?, ?)', [data.toko_id, data.total, data.status], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE orders SET toko_id=?, total=?, status=? WHERE order_id=?', [data.toko_id, data.total, data.status, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM orders WHERE order_id=?', [id], callback);
  }
};

module.exports = Order;
