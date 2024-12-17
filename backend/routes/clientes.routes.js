const router = require('express').Router();
const clienteController = require('../controllers/cliente.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware); // Protege todas las rutas

router.post('/', clienteController.crear);
router.get('/', clienteController.obtenerTodos);
router.get('/:id', clienteController.obtenerPorId);
router.put('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

module.exports = router; 