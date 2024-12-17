const router = require('express').Router();
const peluqueroController = require('../controllers/peluquero.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/peluqueros:
 *   get:
 *     summary: Obtener lista de peluqueros
 *     tags: [Peluqueros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de peluqueros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 * 
 *   post:
 *     summary: Crear nuevo peluquero (solo admin)
 *     tags: [Peluqueros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Peluquero creado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado (solo admin)
 */

/**
 * @swagger
 * /api/peluqueros/{id}:
 *   get:
 *     summary: Obtener peluquero por ID
 *     tags: [Peluqueros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del peluquero
 *       404:
 *         description: Peluquero no encontrado
 * 
 *   delete:
 *     summary: Eliminar peluquero (solo admin)
 *     tags: [Peluqueros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Peluquero eliminado
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Peluquero no encontrado
 */

router.use(authMiddleware);

router.get('/', peluqueroController.obtenerTodos);
router.get('/:id', peluqueroController.obtenerPorId);
router.post('/', checkRole(['admin']), peluqueroController.crear);
router.delete('/:id', checkRole(['admin']), peluqueroController.eliminar);

module.exports = router; 