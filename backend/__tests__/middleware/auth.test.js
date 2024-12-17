const request = require('supertest');
const app = require('../../server');
const { createTestUser } = require('../helpers/auth.helper');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  let token;
  let testUser;

  beforeEach(async () => {
    const testData = await createTestUser();
    token = testData.token;
    testUser = testData.user;
  });

  describe('Protección de rutas', () => {
    it('debería permitir acceso con token válido', async () => {
      const res = await request(app)
        .get('/api/perfil')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it('debería denegar acceso sin token', async () => {
      const res = await request(app).get('/api/perfil');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('mensaje', 'No hay token, autorización denegada');
    });

    it('debería denegar acceso con token inválido', async () => {
      const res = await request(app)
        .get('/api/perfil')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('mensaje', 'Token no válido');
    });

    it('debería denegar acceso con token expirado', async () => {
      const expiredToken = jwt.sign(
        { id: testUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/perfil')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('mensaje', 'Token no válido');
    });
  });
}); 