const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../config/email.config');

const authController = {
  registro: async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;
      
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El email ya está registrado' });
      }

      const usuario = new Usuario({
        nombre,
        email,
        password,
        rol
      });

      await usuario.save();

      const token = jwt.sign(
        { id: usuario._id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ mensaje: 'Credenciales inválidas' });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(400).json({ mensaje: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: usuario._id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
  },

  olvidoPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      // Generar token
      const resetToken = crypto.randomBytes(20).toString('hex');
      usuario.resetPasswordToken = resetToken;
      usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
      await usuario.save();

      // Crear URL de reset
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Enviar email
      const emailEnviado = await sendEmail(
        usuario.email,
        'Recuperación de Contraseña',
        `
        <h1>Has solicitado un cambio de contraseña</h1>
        <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `
      );

      if (!emailEnviado) {
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();
        return res.status(500).json({ mensaje: 'Error al enviar email de recuperación' });
      }

      res.json({ mensaje: 'Se ha enviado un email con las instrucciones' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en recuperación de contraseña', error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      const usuario = await Usuario.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!usuario) {
        return res.status(400).json({ mensaje: 'Token inválido o expirado' });
      }

      // Actualizar contraseña
      usuario.password = password;
      usuario.resetPasswordToken = undefined;
      usuario.resetPasswordExpires = undefined;
      await usuario.save();

      // Enviar email de confirmación
      await sendEmail(
        usuario.email,
        'Contraseña Actualizada',
        `
        <h1>Tu contraseña ha sido actualizada</h1>
        <p>Tu contraseña ha sido cambiada exitosamente.</p>
        <p>Si no realizaste este cambio, contacta con soporte inmediatamente.</p>
        `
      );

      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al restablecer contraseña', error: error.message });
    }
  }
};

module.exports = authController; 