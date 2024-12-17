const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener estadísticas generales (solo admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClientes:
 *                   type: number
 *                 totalPeluqueros:
 *                   type: number
 *                 estadisticasGenerales:
 *                   type: object
 *                   properties:
 *                     totalCortes:
 *                       type: number
 *                     ingresoTotal:
 *                       type: number
 *                 estadisticasPorMes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: string
 *                       total:
 *                         type: number
 *                       cantidad:
 *                         type: number
 *       403:
 *         description: No autorizado (solo admin)
 */

/**
 * @swagger
 * /api/dashboard/peluquero:
 *   get:
 *     summary: Obtener estadísticas del peluquero
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas personales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estadisticasGenerales:
 *                   type: object
 *                   properties:
 *                     totalCortes:
 *                       type: number
 *                     ingresoTotal:
 *                       type: number
 *                 cortesRecientes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Corte'
 */

router.use(authMiddleware);

router.get('/', checkRole(['admin']), dashboardController.obtenerEstadisticas);
router.get('/peluquero', dashboardController.obtenerEstadisticasPeluquero);

module.exports = router; 