const router = require('express').Router();
const perfilController = require('../controllers/perfil.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', perfilController.obtenerPerfil);
router.put('/', perfilController.actualizarPerfil);

module.exports = router; 