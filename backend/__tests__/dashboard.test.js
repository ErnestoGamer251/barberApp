const request = require('supertest');
const app = require('../server');
const { createTestUser } = require('./helpers/auth.helper');
const Cliente = require('../models/Cliente');
const Corte = require('../models/Corte');

describe('Dashboard Controller', () => {
  let adminToken;
  let peluqueroToken;
  let admin;
  let peluquero;
  let testCliente;

  beforeEach(async () => {
    const adminData = await createTestUser({ rol: 'admin' });
    adminToken = adminData.token;
    admin = adminData.user;

    const peluqueroData = await createTestUser({
      email: 'peluquero@test.com',
      rol: 'peluquero'
    });
    peluqueroToken = peluqueroData.token;
    peluquero = peluqueroData.user;

    testCliente = await Cliente.create({
      nombre: 'Cliente Test',
      telefono: '1234567890'
    });

    // Crear algunos cortes de prueba
    await Corte.create([
      {
        cliente: testCliente._id,
        peluquero: peluquero._id,
        tipoCorte: 'Corte básico',
        precio: 15,
        fecha: new Date()
      },
      {
        cliente: testCliente._id,
        peluquero: peluquero._id,
        tipoCorte: 'Corte y barba',
        precio: 25,
        fecha: new Date()
      }
    ]);
  });

  describe('GET /api/dashboard (Admin)', () => {
    it('debería obtener estadísticas generales', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalClientes');
      expect(res.body).toHaveProperty('totalPeluqueros');
      expect(res.body).toHaveProperty('estadisticasGenerales');
      expect(res.body).toHaveProperty('estadisticasPorMes');
      expect(res.body).toHaveProperty('cortesRecientes');
    });

    it('debería denegar acceso a peluqueros', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${peluqueroToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/dashboard/peluquero', () => {
    it('debería obtener estadísticas del peluquero', async () => {
      const res = await request(app)
        .get('/api/dashboard/peluquero')
        .set('Authorization', `Bearer ${peluqueroToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('estadisticasGenerales');
      expect(res.body.estadisticasGenerales).toHaveProperty('totalCortes');
      expect(res.body.estadisticasGenerales).toHaveProperty('ingresoTotal');
      expect(res.body).toHaveProperty('cortesRecientes');
    });
  });
}); 