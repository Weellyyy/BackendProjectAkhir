
const Auth = require('../model/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    Auth.findByUsername(username, async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(401).json({ message: 'User tidak ditemukan' });
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Password salah' });
      const token = jwt.sign({ id: user.user_id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.json({ token });
    });
  },

  register: async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }
    Auth.findByUsername(username, async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length > 0) return res.status(409).json({ message: 'Username sudah digunakan' });
      const hashedPassword = await bcrypt.hash(password, 10);
      Auth.create({ username, password: hashedPassword, role: role || 'admin' }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal membuat user' });
        res.status(201).json({ user_id: result.insertId, username, role: role || 'admin' });
      });
    });
  }
};

module.exports = authController;

