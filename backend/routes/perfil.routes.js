const router = require('express').Router();
const perfilController = require('../controllers/perfil.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 * 
 *   put:
 *     summary: Actualizar perfil
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/perfil/foto:
 *   post:
 *     summary: Subir foto de perfil
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada
 *       400:
 *         description: Archivo inválido
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nombre:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         rol:
 *           type: string
 *           enum: [peluquero, admin]
 *         fotoPerfil:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

router.use(authMiddleware);

router.get('/', perfilController.obtenerPerfil);
router.put('/', perfilController.actualizarPerfil);
router.post('/foto', upload.single('fotoPerfil'), perfilController.actualizarFotoPerfil);

module.exports = router; 