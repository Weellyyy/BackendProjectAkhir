
const Barang = require('../model/barang');

const barangController = {
  getAllBarang: (req, res) => {
    Barang.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  },
  getBarangById: (req, res) => {
    Barang.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'barang tidak ditemukan' });
      res.json(results[0]);
    });
  },
  createBarang: (req, res) => {
    Barang.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ barang_id: result.insertId, ...req.body });
    });
  },
  updateBarang: (req, res) => {
    Barang.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Barang diperbarui' });
    });
  },
  deleteBarang: (req, res) => {
    Barang.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Barang dihapus' });
    });
  }
};

module.exports = barangController;
