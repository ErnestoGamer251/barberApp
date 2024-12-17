const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

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
  },

  actualizarFotoPerfil: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ mensaje: 'No se ha subido ninguna imagen' });
      }

      const usuario = await Usuario.findById(req.usuario.id);
      
      // Eliminar foto anterior si existe
      if (usuario.fotoPerfil) {
        const rutaAnterior = path.join(__dirname, '..', usuario.fotoPerfil);
        try {
          await fs.unlink(rutaAnterior);
        } catch (error) {
          console.error('Error al eliminar imagen anterior:', error);
        }
      }

      usuario.fotoPerfil = '/uploads/' + req.file.filename;
      await usuario.save();

      res.json({
        mensaje: 'Foto de perfil actualizada',
        fotoPerfil: usuario.fotoPerfil
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar foto de perfil', error: error.message });
    }
  }
};

module.exports = perfilController; 