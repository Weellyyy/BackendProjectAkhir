
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Invoice = require('../model/invoice');
const Order = require('../model/order');
const Barang = require('../model/barang');

const invoiceController = {
  getAllInvoice: (req, res) => {
    Invoice.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    });
  },
  getInvoiceById: (req, res) => {
    Invoice.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'Invoice tidak ditemukan' });
      res.json(results[0]);
    });
  },
  createInvoice: (req, res) => {
    Invoice.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ invoice_id: result.insertId, ...req.body });
    });
  },
  deleteInvoice: (req, res) => {
    Invoice.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Invoice dihapus' });
    });
  },
  generateInvoicePDF: (req, res) => {
    const invoiceId = req.params.id;
    Invoice.getById(invoiceId, (err, invoiceResults) => {
      if (err || invoiceResults.length === 0) return res.status(404).json({ message: 'Invoice tidak ditemukan' });
      const invoice = invoiceResults[0];
      Order.getById(invoice.order_id, (err, orderResults) => {
        if (err || orderResults.length === 0) return res.status(404).json({ message: 'Order tidak ditemukan' });
        const order = orderResults[0];
        // Ambil detail barang dari order_detail
        const db = require('../config/db').getConnection();
        db.query('SELECT od.*, b.nama_barang FROM order_detail od JOIN barang b ON od.barang_id = b.barang_id WHERE od.order_id = ?', [order.order_id], (err, items) => {
          if (err) return res.status(500).json({ message: 'Gagal ambil detail barang' });
          // Generate PDF
          const doc = new PDFDocument();
          const filePath = path.join(__dirname, '../public/invoice_' + invoiceId + '.pdf');
          doc.pipe(fs.createWriteStream(filePath));
          doc.fontSize(20).text('INVOICE', { align: 'center' });
          doc.moveDown();
          doc.fontSize(12).text('Invoice ID: ' + invoice.invoice_id);
          doc.text('Order ID: ' + order.order_id);
          doc.text('Tanggal: ' + invoice.tanggal);
          doc.text('Total: Rp ' + order.total);
          doc.moveDown();
          doc.text('Barang:');
          items.forEach(item => {
            doc.text(`- ${item.nama_barang} x${item.jumlah} @Rp${item.harga_satuan} = Rp${item.subtotal}`);
          });
          doc.end();
          doc.on('finish', () => {
            res.download(filePath, 'invoice_' + invoiceId + '.pdf');
          });
        });
      });
    });
  }
};

module.exports = invoiceController;
