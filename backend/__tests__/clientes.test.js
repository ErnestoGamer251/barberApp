const request = require('supertest');
const app = require('../server');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const jwt = require('jsonwebtoken');

describe('Clientes Controller', () => {
  let token;
  let testUser;

  beforeEach(async () => {
    testUser = await Usuario.create({
      nombre: 'Test User',
      email: 'test@test.com',
      password: '123456',
      rol: 'peluquero'
    });

    token = jwt.sign(
      { id: testUser._id, rol: testUser.rol },
      process.env.JWT_SECRET
    );
  });

  describe('GET /api/clientes', () => {
    it('debería obtener lista de clientes', async () => {
      await Cliente.create([
        { nombre: 'Cliente 1', telefono: '1234567890' },
        { nombre: 'Cliente 2', telefono: '0987654321' }
      ]);

      const res = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(2);
    });
  });

  describe('POST /api/clientes', () => {
    it('debería crear un nuevo cliente', async () => {
      const clienteData = {
        nombre: 'Nuevo Cliente',
        telefono: '1234567890',
        email: 'cliente@test.com'
      };

      const res = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send(clienteData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('nombre', clienteData.nombre);
      expect(res.body).toHaveProperty('telefono', clienteData.telefono);
    });
  });
}); 