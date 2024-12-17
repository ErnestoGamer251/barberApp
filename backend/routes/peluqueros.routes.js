const router = require('express').Router();
const peluqueroController = require('../controllers/peluquero.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

router.use(authMiddleware);

// Solo los admins pueden ver la lista completa de peluqueros
router.get('/', checkRole(['admin']), peluqueroController.obtenerTodos);
router.get('/:id', peluqueroController.obtenerPorId);

module.exports = router; 