const Cliente = require('../models/Cliente');

const clienteController = {
  crear: async (req, res) => {
    try {
      const { nombre, telefono, email } = req.body;
      const cliente = new Cliente({
        nombre,
        telefono,
        email
      });

      await cliente.save();
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear cliente', error: error.message });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const clientes = await Cliente.find()
        .populate('historialCortes');
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const cliente = await Cliente.findById(req.params.id)
        .populate('historialCortes');
      
      if (!cliente) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      }
      
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const cliente = await Cliente.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!cliente) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar cliente', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const cliente = await Cliente.findByIdAndDelete(req.params.id);
      
      if (!cliente) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      }

      res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
    }
  }
};

module.exports = clienteController; 