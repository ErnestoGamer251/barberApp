const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const perfilController = {
  obtenerPerfil: async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.usuario.id).select('-password');
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
    }
  },

  actualizarPerfil: async (req, res) => {
    try {
      const { nombre, email, password } = req.body;
      const usuario = await Usuario.findById(req.usuario.id);

      if (email && email !== usuario.email) {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
          return res.status(400).json({ mensaje: 'El email ya está en uso' });
        }
      }

      usuario.nombre = nombre || usuario.nombre;
      usuario.email = email || usuario.email;
      
      if (password) {
        usuario.password = password;
      }

      await usuario.save();
      
      const usuarioActualizado = await Usuario.findById(usuario._id).select('-password');
      res.json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
    }
  }
};

module.exports = perfilController; 