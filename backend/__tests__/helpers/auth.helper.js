const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    nombre: 'Test User',
    email: 'test@test.com',
    password: '123456',
    rol: 'peluquero'
  };

  const user = await Usuario.create({ ...defaultUser, ...userData });
  const token = jwt.sign(
    { id: user._id, rol: user.rol },
    process.env.JWT_SECRET
  );

  return { user, token };
};

module.exports = {
  createTestUser
}; 