// Model untuk toko
const { getConnection } = require('../config/db');

const Toko = {
  getAll: (callback) => {
    const db = getConnection();
    db.query('SELECT * FROM toko', callback);
  },
  getById: (id, callback) => {
    const db = getConnection();
    db.query('SELECT * FROM toko WHERE toko_id = ?', [id], callback);
  },
  create: (data, callback) => {
    const db = getConnection();
    db.query('INSERT INTO toko (nama_toko, alamat, kontak) VALUES (?, ?, ?)', [data.nama_toko, data.alamat, data.kontak], callback);
  },
  update: (id, data, callback) => {
    const db = getConnection();
    db.query('UPDATE toko SET nama_toko=?, alamat=?, kontak=? WHERE toko_id=?', [data.nama_toko, data.alamat, data.kontak, id], callback);
  },
  delete: (id, callback) => {
    const db = getConnection();
    db.query('DELETE FROM toko WHERE toko_id=?', [id], callback);
  },
  checkOrderExists: (id, callback) => {
    const db = getConnection();
    db.query('SELECT COUNT(*) as count FROM orders WHERE toko_id=?', [id], callback);
  }
};

module.exports = Toko;
