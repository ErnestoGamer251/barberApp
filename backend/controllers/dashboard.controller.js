const Corte = require('../models/Corte');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

const dashboardController = {
  obtenerEstadisticas: async (req, res) => {
    try {
      // Estadísticas generales
      const [
        totalClientes,
        totalPeluqueros,
        estadisticasCortes,
        cortesRecientes
      ] = await Promise.all([
        Cliente.countDocuments(),
        Usuario.countDocuments({ rol: 'peluquero' }),
        Corte.aggregate([
          {
            $group: {
              _id: null,
              totalCortes: { $sum: 1 },
              ingresoTotal: { $sum: '$precio' },
              promedioCorte: { $avg: '$precio' }
            }
          }
        ]),
        Corte.find()
          .sort({ fecha: -1 })
          .limit(5)
          .populate('peluquero', 'nombre')
          .populate('cliente', 'nombre')
      ]);

      // Estadísticas por mes (últimos 6 meses)
      const estadisticasPorMes = await Corte.aggregate([
        {
          $match: {
            fecha: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
          }
        },
        {
          $group: {
            _id: {
              mes: { $month: '$fecha' },
              año: { $year: '$fecha' }
            },
            totalCortes: { $sum: 1 },
            ingresoTotal: { $sum: '$precio' }
          }
        },
        { $sort: { '_id.año': -1, '_id.mes': -1 } }
      ]);

      res.json({
        totalClientes,
        totalPeluqueros,
        estadisticasGenerales: estadisticasCortes[0] || {
          totalCortes: 0,
          ingresoTotal: 0,
          promedioCorte: 0
        },
        estadisticasPorMes,
        cortesRecientes
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
    }
  },

  obtenerEstadisticasPeluquero: async (req, res) => {
    try {
      const peluqueroId = req.usuario.id;

      const [estadisticasGenerales, cortesRecientes] = await Promise.all([
        Corte.aggregate([
          { $match: { peluquero: peluqueroId } },
          {
            $group: {
              _id: null,
              totalCortes: { $sum: 1 },
              ingresoTotal: { $sum: '$precio' },
              promedioCorte: { $avg: '$precio' }
            }
          }
        ]),
        Corte.find({ peluquero: peluqueroId })
          .sort({ fecha: -1 })
          .limit(5)
          .populate('cliente', 'nombre')
      ]);

      res.json({
        estadisticasGenerales: estadisticasGenerales[0] || {
          totalCortes: 0,
          ingresoTotal: 0,
          promedioCorte: 0
        },
        cortesRecientes
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
    }
  }
};

module.exports = dashboardController; 