const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, invoiceController.getAllInvoice);
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);
router.post('/', authenticateToken, invoiceController.createInvoice);
router.delete('/:id', authenticateToken, invoiceController.deleteInvoice);
router.get('/:id/cetak', authenticateToken, invoiceController.generateInvoicePDF);

module.exports = router;
