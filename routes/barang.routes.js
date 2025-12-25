const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barang.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Semua route barang diproteksi token
router.get('/', authenticateToken, barangController.getAllBarang);
router.get('/:id', authenticateToken, barangController.getBarangById);
router.post('/', authenticateToken, barangController.createBarang);
router.put('/:id', authenticateToken, barangController.updateBarang);
router.delete('/:id', authenticateToken, barangController.deleteBarang);

module.exports = router;
