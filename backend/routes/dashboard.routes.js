const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

router.use(authMiddleware);

// Ruta para estadísticas generales (solo admin)
router.get('/', checkRole(['admin']), dashboardController.obtenerEstadisticas);

// Ruta para estadísticas del peluquero
router.get('/peluquero', checkRole(['peluquero']), dashboardController.obtenerEstadisticasPeluquero);

module.exports = router; 