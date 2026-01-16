// Model untuk order
const { getConnection } = require('../config/db');

const Order = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT o.*, t.nama_toko, u.username, i.invoice_id, i.file_url FROM orders o LEFT JOIN toko t ON o.toko_id = t.toko_id LEFT JOIN users u ON o.user_id = u.user_id LEFT JOIN invoice i ON o.order_id = i.order_id ORDER BY o.order_id DESC', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT o.*, t.nama_toko, u.username FROM orders o LEFT JOIN toko t ON o.toko_id = t.toko_id LEFT JOIN users u ON o.user_id = u.user_id WHERE o.order_id = ?', [id], callback);
  },
  getWithDetails: (id, callback) => {
    const db = getConnection();
    db.query(`
      SELECT o.*, t.nama_toko, u.username,
        od.orderdetail_id, od.barang_id, od.jumlah, od.harga_satuan, od.subtotal,
        b.nama_barang, b.gambar_url
      FROM orders o
      LEFT JOIN toko t ON o.toko_id = t.toko_id
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_detail od ON o.order_id = od.order_id
      LEFT JOIN barang b ON od.barang_id = b.barang_id
      WHERE o.order_id = ?
    `, [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO orders (toko_id, user_id, total, status) VALUES (?, ?, ?, ?)', [data.toko_id, data.user_id, data.total, data.status || 'pending'], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE orders SET toko_id=?, user_id=?, total=?, status=? WHERE order_id=?', [data.toko_id, data.user_id, data.total, data.status, id], callback);
  },
  updateStatus: (id, status, callback) => {
    const db = getConnection();
    db.query('UPDATE orders SET status=? WHERE order_id=?', [status, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM orders WHERE order_id=?', [id], callback);
  }
};

module.exports = Order;
