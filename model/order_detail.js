// Model untuk order_detail
const { getConnection } = require('../config/db');

const OrderDetail = {
  getByOrderId: (orderId, callback) => {
    const db = getConnection();
    db.query('SELECT od.*, b.nama_barang, b.gambar_url FROM order_detail od LEFT JOIN barang b ON od.barang_id = b.barang_id WHERE od.order_id = ?', [orderId], callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT od.*, b.nama_barang FROM order_detail od LEFT JOIN barang b ON od.barang_id = b.barang_id WHERE od.orderdetail_id = ?', [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO order_detail (order_id, barang_id, jumlah, harga_satuan, subtotal) VALUES (?, ?, ?, ?, ?)', [data.order_id, data.barang_id, data.jumlah, data.harga_satuan, data.subtotal], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE order_detail SET barang_id=?, jumlah=?, harga_satuan=?, subtotal=? WHERE orderdetail_id=?', [data.barang_id, data.jumlah, data.harga_satuan, data.subtotal, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM order_detail WHERE orderdetail_id=?', [id], callback);
  },
  deleteByOrderId: (orderId, callback) => {
    const db = getConnection();
    db.query('DELETE FROM order_detail WHERE order_id=?', [orderId], callback);
  }
};

module.exports = OrderDetail;
