
const Order = require('../model/order');

const orderController = {
  getAllOrder: (req, res) => {
    Order.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  },
  getOrderById: (req, res) => {
    Order.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'Order tidak ditemukan' });
      res.json(results[0]);
    });
  },
  createOrder: (req, res) => {
    Order.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ order_id: result.insertId, ...req.body });
    });
  },
  updateOrder: (req, res) => {
    Order.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Order diperbarui' });
    });
  },
  deleteOrder: (req, res) => {
    Order.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Order dihapus' });
    });
  }
};

module.exports = orderController;
