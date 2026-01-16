const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barang.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Semua route barang diproteksi token
router.get('/', authenticateToken, barangController.getAllBarang);
router.get('/:id', authenticateToken, barangController.getBarangById);

// Route untuk create & update dengan upload gambar
router.post('/', authenticateToken, upload.single('gambar'), barangController.createBarang);
router.put('/:id', authenticateToken, upload.single('gambar'), barangController.updateBarang);

router.delete('/:id', authenticateToken, barangController.deleteBarang);

module.exports = router;