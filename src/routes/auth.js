const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateRegister } = require('../middleware/validate');

router.post('/register', validateRegister, async (req, res) => {
  const { nombre, apellido, correo, contraseña } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = User.findOne({ correo });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Crear nuevo usuario
    const user = new User({ nombre, apellido, correo, contraseña });
    await user.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;