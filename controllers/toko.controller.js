
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
    Toko.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Toko dihapus' });
    });
  }
};

module.exports = tokoController;
