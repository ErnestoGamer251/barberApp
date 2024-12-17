const Usuario = require('../models/Usuario');
const Corte = require('../models/Corte');

const peluqueroController = {
  obtenerTodos: async (req, res) => {
    try {
      const peluqueros = await Usuario.find({ rol: 'peluquero' })
        .select('-password');
      res.json(peluqueros);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener peluqueros', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const peluquero = await Usuario.findOne({
        _id: req.params.id,
        rol: 'peluquero'
      }).select('-password');

      if (!peluquero) {
        return res.status(404).json({ mensaje: 'Peluquero no encontrado' });
      }

      // Obtener estadísticas de cortes
      const estadisticas = await Corte.aggregate([
        { $match: { peluquero: peluquero._id } },
        {
          $group: {
            _id: null,
            totalCortes: { $sum: 1 },
            ingresoTotal: { $sum: '$precio' },
            promedioCorte: { $avg: '$precio' }
          }
        }
      ]);

      res.json({
        peluquero,
        estadisticas: estadisticas[0] || {
          totalCortes: 0,
          ingresoTotal: 0,
          promedioCorte: 0
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener peluquero', error: error.message });
    }
  }
};

module.exports = peluqueroController; 