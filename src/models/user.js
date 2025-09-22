const bcrypt = require('bcryptjs');

// Almacenamiento en memoria
let users = [];

class User {
  constructor({ nombre, apellido, correo, contraseña }) {
    this.id = users.length + 1;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.contraseña = contraseña;
  }

  // Método para hashear la contraseña
  async save() {
    this.contraseña = await bcrypt.hash(this.contraseña, 10);
    users.push(this);
    return this;
  }

  // Métodos estáticos para interactuar con el arreglo de usuarios
  static findOne({ correo }) {
    return users.find(user => user.correo === correo);
  }

  static clear() {
    users = [];
  }
}

module.exports = User;