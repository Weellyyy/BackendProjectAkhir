const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Route yang lebih spesifik harus didahulukan (sebelum :id)
router.get('/order/:orderId', authenticateToken, invoiceController.getInvoiceByOrderId);
router.get('/:id/cetak', authenticateToken, invoiceController.generateInvoicePDF);

// Route yang lebih umum (dengan :id) di akhir
router.get('/', authenticateToken, invoiceController.getAllInvoice);
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);

router.post('/', authenticateToken, invoiceController.createInvoice);
router.delete('/:id', authenticateToken, invoiceController.deleteInvoice);

module.exports = router;
