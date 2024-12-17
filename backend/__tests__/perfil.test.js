const request = require('supertest');
const app = require('../server');
const { createTestUser } = require('./helpers/auth.helper');
const path = require('path');

describe('Perfil Controller', () => {
  let token;
  let testUser;

  beforeEach(async () => {
    const testData = await createTestUser();
    token = testData.token;
    testUser = testData.user;
  });

  describe('GET /api/perfil', () => {
    it('debería obtener el perfil del usuario', async () => {
      const res = await request(app)
        .get('/api/perfil')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('nombre', testUser.nombre);
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('debería fallar sin token de autenticación', async () => {
      const res = await request(app).get('/api/perfil');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/perfil', () => {
    it('debería actualizar el perfil del usuario', async () => {
      const updateData = {
        nombre: 'Nuevo Nombre',
        email: 'nuevo@test.com'
      };

      const res = await request(app)
        .put('/api/perfil')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('nombre', updateData.nombre);
      expect(res.body).toHaveProperty('email', updateData.email);
    });

    it('debería actualizar la contraseña correctamente', async () => {
      const updateData = {
        password: 'nuevaContraseña123'
      };

      const res = await request(app)
        .put('/api/perfil')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);

      // Intentar login con nueva contraseña
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: updateData.password
        });

      expect(loginRes.statusCode).toBe(200);
    });
  });

  describe('POST /api/perfil/foto', () => {
    it('debería subir una foto de perfil', async () => {
      const res = await request(app)
        .post('/api/perfil/foto')
        .set('Authorization', `Bearer ${token}`)
        .attach('fotoPerfil', path.join(__dirname, 'fixtures/test-image.jpg'));

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('fotoPerfil');
      expect(res.body.fotoPerfil).toMatch(/^\/uploads\//);
    });

    it('debería fallar con archivo no válido', async () => {
      const res = await request(app)
        .post('/api/perfil/foto')
        .set('Authorization', `Bearer ${token}`)
        .attach('fotoPerfil', path.join(__dirname, 'fixtures/test-file.txt'));

      expect(res.statusCode).toBe(400);
    });
  });
}); 