const request = require('supertest');
const app = require('../server');
const Usuario = require('../models/Usuario');

describe('Auth Controller', () => {
  const testUser = {
    nombre: 'Test User',
    email: 'test@test.com',
    password: '123456',
    rol: 'peluquero'
  };

  describe('POST /api/auth/registro', () => {
    it('debería registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.usuario).toHaveProperty('id');
      expect(res.body.usuario.email).toBe(testUser.email);
    });

    it('debería fallar si el email ya existe', async () => {
      await Usuario.create(testUser);

      const res = await request(app)
        .post('/api/auth/registro')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('mensaje', 'El email ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await Usuario.create(testUser);
    });

    it('debería hacer login correctamente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.usuario.email).toBe(testUser.email);
    });

    it('debería fallar con credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('mensaje', 'Credenciales inválidas');
    });
  });
}); 