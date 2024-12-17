const Corte = require('../models/Corte');
const Cliente = require('../models/Cliente');

const corteController = {
  crear: async (req, res) => {
    try {
      const { clienteId, tipoCorte, precio } = req.body;
      
      const corte = new Corte({
        peluquero: req.usuario.id, // El peluquero es el usuario autenticado
        cliente: clienteId,
        tipoCorte,
        precio
      });

      await corte.save();

      // Actualizar el historial de cortes del cliente
      await Cliente.findByIdAndUpdate(
        clienteId,
        { $push: { historialCortes: corte._id } }
      );

      await corte.populate('peluquero cliente');
      res.status(201).json(corte);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear corte', error: error.message });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const { desde, hasta, peluqueroId } = req.query;
      let filtro = {};

      if (desde || hasta) {
        filtro.fecha = {};
        if (desde) filtro.fecha.$gte = new Date(desde);
        if (hasta) filtro.fecha.$lte = new Date(hasta);
      }

      if (peluqueroId) {
        filtro.peluquero = peluqueroId;
      }

      const cortes = await Corte.find(filtro)
        .populate('peluquero', 'nombre email')
        .populate('cliente', 'nombre telefono')
        .sort({ fecha: -1 });

      res.json(cortes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener cortes', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const corte = await Corte.findById(req.params.id)
        .populate('peluquero', 'nombre email')
        .populate('cliente', 'nombre telefono');

      if (!corte) {
        return res.status(404).json({ mensaje: 'Corte no encontrado' });
      }

      res.json(corte);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener corte', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { tipoCorte, precio } = req.body;
      
      const corte = await Corte.findById(req.params.id);
      
      if (!corte) {
        return res.status(404).json({ mensaje: 'Corte no encontrado' });
      }

      // Solo el peluquero que creó el corte o un admin puede modificarlo
      if (corte.peluquero.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado para modificar este corte' });
      }

      corte.tipoCorte = tipoCorte || corte.tipoCorte;
      corte.precio = precio || corte.precio;

      await corte.save();
      await corte.populate('peluquero cliente');

      res.json(corte);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar corte', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const corte = await Corte.findById(req.params.id);
      
      if (!corte) {
        return res.status(404).json({ mensaje: 'Corte no encontrado' });
      }

      // Solo el peluquero que creó el corte o un admin puede eliminarlo
      if (corte.peluquero.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado para eliminar este corte' });
      }

      // Eliminar la referencia del corte en el cliente
      await Cliente.findByIdAndUpdate(
        corte.cliente,
        { $pull: { historialCortes: corte._id } }
      );

      await corte.deleteOne();
      res.json({ mensaje: 'Corte eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar corte', error: error.message });
    }
  }
};

module.exports = corteController; 