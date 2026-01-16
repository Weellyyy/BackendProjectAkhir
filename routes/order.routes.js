const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, orderController.getAllOrder);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.get('/:id/details', authenticateToken, orderController.getOrderWithDetails);
router.post('/', authenticateToken, orderController.createOrder);
router.put('/:id', authenticateToken, orderController.updateOrder);
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.delete('/:id', authenticateToken, orderController.deleteOrder);

module.exports = router;
