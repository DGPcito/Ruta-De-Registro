const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');

describe('Pruebas de la ruta de registro (/api/auth/register)', () => {
  afterEach(() => {
    User.clear();
  });

// Prueba de éxito
  it('Debería registrar un usuario correctamente', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado correctamente');
  });

  // Pruebas de validación de campos
  it('Debería fallar si el nombre está vacío', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: '',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Nombre inválido o vacío');
  });

  it('Debería fallar si el apellido está vacío', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: '',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Apellido inválido o vacío');
  });

  it('Debería fallar si el correo es inválido', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM-hotmail-com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Correo inválido');
  });

  it('Debería fallar si la contraseña no es segura', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: '123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Contraseña no segura. Debe tener al menos 8 caracteres, letras y números');
  });

  it('Debería fallar si el correo ya está registrado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Moreira',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('El correo ya está registrado');
  });

  // Prueba de integridad de datos
  it('Debería almacenar la contraseña en hash', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    const user = User.findOne({ correo: 'DiegoM@hotmail.com' });
    expect(user.contraseña).not.toBe('PruebaDeContra123');
    expect(await bcrypt.compare('PruebaDeContra123', user.contraseña)).toBe(true);
  });

    // Prueba de respuesta de la API
  it('Debería devolver una respuesta en formato JSON con propiedades esperadas', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Diego',
        apellido: 'Mendez',
        correo: 'DiegoM@hotmail.com',
        contraseña: 'PruebaDeContra123',
      });

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('message');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('nombre');
    expect(response.body.user).toHaveProperty('apellido'); 
    expect(response.body.user).toHaveProperty('correo'); 
  });

// Prueba de errores inesperados
it('Debería manejar errores internos del servidor', async () => {
  const mockHash = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
    throw new Error('Error simulado');
  });

  const response = await request(app)
    .post('/api/auth/register')
    .send({
      nombre: 'Diego',
      apellido: 'Mendez',
      correo: 'DiegoM@hotmail.com',
      contraseña: 'PruebaDeContra123',
    });

  expect(response.status).toBe(500);
  expect(response.body.error).toBe('Error interno del servidor');

  mockHash.mockRestore();
})
});