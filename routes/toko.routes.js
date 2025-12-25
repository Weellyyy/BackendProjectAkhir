const express = require('express');
const router = express.Router();
const tokoController = require('../controllers/toko.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, tokoController.getAllToko);
router.get('/:id', authenticateToken, tokoController.getTokoById);
router.post('/', authenticateToken, tokoController.createToko);
router.put('/:id', authenticateToken, tokoController.updateToko);
router.delete('/:id', authenticateToken, tokoController.deleteToko);

module.exports = router;
