// Model untuk barang
const { getConnection } = require('../config/db');

const Barang = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT * FROM barang', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT * FROM barang WHERE barang_id = ?', [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO barang (nama_barang, stok, harga, gambar_url) VALUES (?, ?, ?, ?)', [data.nama_barang, data.stok, data.harga, data.gambar_url], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE barang SET nama_barang=?, stok=?, harga=?, gambar_url=? WHERE barang_id=?', [data.nama_barang, data.stok, data.harga, data.gambar_url, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM barang WHERE barang_id=?', [id], callback);
  }
};

module.exports = Barang;
