const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

module.exports = app;