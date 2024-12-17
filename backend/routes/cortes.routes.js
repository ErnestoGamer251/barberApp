const router = require('express').Router();
const corteController = require('../controllers/corte.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { corteValidation } = require('../middleware/validator.middleware');

/**
 * @swagger
 * /api/cortes:
 *   get:
 *     summary: Obtener lista de cortes
 *     tags: [Cortes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para filtrar
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para filtrar
 *     responses:
 *       200:
 *         description: Lista de cortes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Corte'
 *       401:
 *         description: No autorizado
 * 
 *   post:
 *     summary: Crear nuevo corte
 *     tags: [Cortes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CorteInput'
 *     responses:
 *       201:
 *         description: Corte creado
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/cortes/{id}:
 *   get:
 *     summary: Obtener corte por ID
 *     tags: [Cortes]
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
 *         description: Detalles del corte
 *       404:
 *         description: Corte no encontrado
 * 
 *   delete:
 *     summary: Eliminar corte
 *     tags: [Cortes]
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
 *         description: Corte eliminado
 *       404:
 *         description: Corte no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Corte:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         cliente:
 *           $ref: '#/components/schemas/Cliente'
 *         peluquero:
 *           $ref: '#/components/schemas/Usuario'
 *         tipoCorte:
 *           type: string
 *         precio:
 *           type: number
 *         fecha:
 *           type: string
 *           format: date-time
 *     
 *     CorteInput:
 *       type: object
 *       required:
 *         - clienteId
 *         - tipoCorte
 *         - precio
 *       properties:
 *         clienteId:
 *           type: string
 *         tipoCorte:
 *           type: string
 *         precio:
 *           type: number
 */

router.use(authMiddleware);

router.post('/', corteValidation, corteController.crear);
router.get('/', corteController.obtenerTodos);
router.get('/:id', corteController.obtenerPorId);
router.delete('/:id', corteController.eliminar);

module.exports = router; 