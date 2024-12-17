const request = require('supertest');
const app = require('../server');
const { createTestUser } = require('./helpers/auth.helper');
const Cliente = require('../models/Cliente');
const Corte = require('../models/Corte');

describe('Cortes Controller', () => {
  let token;
  let testUser;
  let testCliente;

  beforeEach(async () => {
    const testData = await createTestUser();
    token = testData.token;
    testUser = testData.user;

    testCliente = await Cliente.create({
      nombre: 'Cliente Test',
      telefono: '1234567890',
      email: 'cliente@test.com'
    });
  });

  describe('GET /api/cortes', () => {
    it('debería obtener lista de cortes', async () => {
      await Corte.create([
        {
          cliente: testCliente._id,
          peluquero: testUser._id,
          tipoCorte: 'Corte básico',
          precio: 15
        },
        {
          cliente: testCliente._id,
          peluquero: testUser._id,
          tipoCorte: 'Corte y barba',
          precio: 25
        }
      ]);

      const res = await request(app)
        .get('/api/cortes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(2);
    });

    it('debería filtrar cortes por fecha', async () => {
      const fechaInicio = new Date('2024-01-01');
      const fechaFin = new Date('2024-12-31');

      await Corte.create([
        {
          cliente: testCliente._id,
          peluquero: testUser._id,
          tipoCorte: 'Corte básico',
          precio: 15,
          fecha: new Date('2024-06-15')
        },
        {
          cliente: testCliente._id,
          peluquero: testUser._id,
          tipoCorte: 'Corte y barba',
          precio: 25,
          fecha: new Date('2023-12-31')
        }
      ]);

      const res = await request(app)
        .get('/api/cortes')
        .query({
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString()
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(new Date(res.body[0].fecha)).toBeGreaterThanOrEqual(fechaInicio);
      expect(new Date(res.body[0].fecha)).toBeLessThanOrEqual(fechaFin);
    });
  });

  describe('POST /api/cortes', () => {
    it('debería crear un nuevo corte', async () => {
      const corteData = {
        clienteId: testCliente._id,
        tipoCorte: 'Corte moderno',
        precio: 20
      };

      const res = await request(app)
        .post('/api/cortes')
        .set('Authorization', `Bearer ${token}`)
        .send(corteData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('tipoCorte', corteData.tipoCorte);
      expect(res.body).toHaveProperty('precio', corteData.precio);
      expect(res.body.peluquero.toString()).toBe(testUser._id.toString());
    });

    it('debería fallar si faltan datos requeridos', async () => {
      const corteData = {
        clienteId: testCliente._id
        // Falta tipoCorte y precio
      };

      const res = await request(app)
        .post('/api/cortes')
        .set('Authorization', `Bearer ${token}`)
        .send(corteData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
}); 