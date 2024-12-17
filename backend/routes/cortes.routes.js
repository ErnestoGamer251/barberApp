const router = require('express').Router();
const corteController = require('../controllers/corte.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

router.use(authMiddleware);

// Rutas públicas para usuarios autenticados
router.get('/', corteController.obtenerTodos);
router.get('/:id', corteController.obtenerPorId);

// Rutas solo para peluqueros y admins
router.post('/', checkRole(['peluquero', 'admin']), corteController.crear);
router.put('/:id', checkRole(['peluquero', 'admin']), corteController.actualizar);
router.delete('/:id', checkRole(['peluquero', 'admin']), corteController.eliminar);

module.exports = router; 