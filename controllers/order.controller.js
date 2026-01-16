const Order = require('../model/order');
const OrderDetail = require('../model/order_detail');
const Invoice = require('../model/invoice');
const { getConnection } = require('../config/db');

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
  
  getOrderWithDetails: (req, res) => {
    Order.getWithDetails(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'Order tidak ditemukan' });
      
      // Format data order dengan detail items
      const order = {
        order_id: results[0].order_id,
        tanggal: results[0].tanggal,
        toko_id: results[0].toko_id,
        nama_toko: results[0].nama_toko,
        user_id: results[0].user_id,
        username: results[0].username,
        total: results[0].total,
        status: results[0].status,
        items: results.filter(r => r.orderdetail_id).map(r => ({
          orderdetail_id: r.orderdetail_id,
          barang_id: r.barang_id,
          nama_barang: r.nama_barang,
          jumlah: r.jumlah,
          harga_satuan: r.harga_satuan,
          subtotal: r.subtotal,
          gambar_url: r.gambar_url
        }))
      };
      res.json(order);
    });
  },
  
  createOrder: (req, res) => {
  const { toko_id, user_id, items, status } = req.body
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Items tidak boleh kosong' })
  }

  const db = getConnection()

  // 🔥 AGREGASI JUMLAH PER BARANG
  const stokMap = {}
  items.forEach(item => {
    stokMap[item.barang_id] = (stokMap[item.barang_id] || 0) + item.jumlah
  })

  const barangIds = Object.keys(stokMap)
  let total = 0

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Transaction error' })

    // 🔒 LOCK BARANG
    db.query(
      'SELECT barang_id, stok FROM barang WHERE barang_id IN (?) FOR UPDATE',
      [barangIds],
      (err, barangList) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ message: 'Query error' }))
        }

        // ✅ VALIDASI STOK
        for (const barang of barangList) {
          if (barang.stok < stokMap[barang.barang_id]) {
            return db.rollback(() =>
              res.status(400).json({ message: 'Stok tidak cukup' })
            )
          }
        }

        // HITUNG TOTAL
        items.forEach(i => {
          i.subtotal = i.jumlah * i.harga_satuan
          total += i.subtotal
        })

        // INSERT ORDER
        Order.create({ toko_id, user_id, total, status }, (err, result) => {
          if (err) return db.rollback(() => res.status(500).json({ message: 'Insert order gagal' }))

          const orderId = result.insertId

          const detailValues = items.map(i => [
            orderId,
            i.barang_id,
            i.jumlah,
            i.harga_satuan,
            i.subtotal
          ])

          db.query(
            'INSERT INTO order_detail (order_id, barang_id, jumlah, harga_satuan, subtotal) VALUES ?',
            [detailValues],
            err => {
              if (err) return db.rollback(() => res.status(500).json({ message: 'Insert detail gagal' }))

              // 🔥 UPDATE STOK SEKALI PER BARANG
              const updatePromises = Object.entries(stokMap).map(
                ([barangId, jumlah]) =>
                  new Promise((resolve, reject) => {
                    db.query(
                      'UPDATE barang SET stok = stok - ? WHERE barang_id = ?',
                      [jumlah, barangId],
                      err => (err ? reject(err) : resolve())
                    )
                  })
              )

              Promise.all(updatePromises)
                .then(() => {
                  Invoice.create({ order_id: orderId, file_url: null }, err => {
                    if (err) return db.rollback(() => res.status(500).json({ message: 'Invoice gagal' }))

                    db.commit(err => {
                      if (err) return db.rollback(() => res.status(500).json({ message: 'Commit gagal' }))

                      res.status(201).json({
                        message: 'Order berhasil dibuat',
                        order_id: orderId,
                        total
                      })
                    })
                  })
                })
                .catch(() => db.rollback(() => res.status(500).json({ message: 'Update stok gagal' })))
            }
          )
        })
      }
    )
  })
},


  
  updateOrder: (req, res) => {
    Order.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Order diperbarui' });
    });
  },
  
  updateOrderStatus: (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status harus diisi' });
    
    Order.updateStatus(req.params.id, status, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Status order diperbarui', status });
    });
  },
  
  deleteOrder: (req, res) => {
    const db = getConnection();
    const orderId = req.params.id;
    
    console.log('[ORDER] Deleting order:', orderId);
    
    // Jika ingin restore stok saat delete, bisa tambahkan logika di sini
    // Untuk sekarang, hanya delete order (cascade delete order_detail dan invoice)
    
    Order.delete(orderId, (err) => {
      if (err) {
        console.error('[ORDER] Error deleting order:', err);
        return res.status(500).json({ message: 'Server error', error: err });
      }
      console.log('[ORDER] Order deleted successfully');
      res.json({ message: 'Order dihapus' });
    });
  }
};

module.exports = orderController;

