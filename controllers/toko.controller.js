
const Toko = require('../model/toko');

const tokoController = {
  getAllToko: (req, res) => {
    Toko.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  },
  getTokoById: (req, res) => {
    Toko.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'Toko tidak ditemukan' });
      res.json(results[0]);
    });
  },
  createToko: (req, res) => {
    Toko.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ toko_id: result.insertId, ...req.body });
    });
  },
  updateToko: (req, res) => {
    Toko.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Toko diperbarui' });
    });
  },
  deleteToko: (req, res) => {
    // Cek dulu apakah ada order yang terkait dengan toko ini
    Toko.checkOrderExists(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      
      const orderCount = results[0].count;
      if (orderCount > 0) {
        return res.status(400).json({ 
          message: 'Tidak dapat menghapus toko karena masih memiliki order terkait',
          detail: `Terdapat ${orderCount} order yang terkait dengan toko ini`
        });
      }
      
      // Jika tidak ada order terkait, lanjutkan penghapusan
      Toko.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Toko berhasil dihapus' });
      });
    });
  }
};

module.exports = tokoController;
