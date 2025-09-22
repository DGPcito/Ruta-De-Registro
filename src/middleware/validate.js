const validateRegister = (req, res, next) => {
  const { nombre, apellido, correo, contraseña } = req.body;

  if (!nombre || !/^[a-zA-Z]+$/.test(nombre)) {
    return res.status(400).json({ error: 'Nombre inválido o vacío' });
  }

  if (!apellido || !/^[a-zA-Z]+$/.test(apellido)) {
    return res.status(400).json({ error: 'Apellido inválido o vacío' });
  }

  if (!correo || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  if (!contraseña || contraseña.length < 8 || !/[a-zA-Z]/.test(contraseña) || !/[0-9]/.test(contraseña)) {
    return res.status(400).json({ error: 'Contraseña no segura. Debe tener al menos 8 caracteres, letras y números' });
  }

  next();
};

module.exports = { validateRegister };