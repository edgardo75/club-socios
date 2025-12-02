import { Router } from 'express';
import { SociosController } from '../controllers/socios.controller';
import { upload } from '../config/upload';
import { validate } from '../middlewares/validate.middleware';
import { createSocioSchema, updateSocioSchema } from '../schemas/socio.schema';

const router = Router();
const sociosController = new SociosController();

/**
 * @swagger
 * /api/socios:
 *   get:
 *     summary: Obtener todos los socios
 *     tags: [Socios]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre, apellido o DNI)
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *         description: Incluir socios eliminados
 *     responses:
 *       200:
 *         description: Lista de socios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Socio'
 */
router.get('/', sociosController.getAll);

/**
 * @swagger
 * /api/socios/check/has-deleted:
 *   get:
 *     summary: Verificar si hay socios eliminados
 *     tags: [Socios]
 *     responses:
 *       200:
 *         description: Estado de socios eliminados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasDeleted:
 *                   type: boolean
 */
router.get('/check/has-deleted', sociosController.checkDeleted);

/**
 * @swagger
 * /api/socios/{dni}:
 *   get:
 *     summary: Obtener un socio por DNI
 *     tags: [Socios]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *         description: DNI del socio
 *     responses:
 *       200:
 *         description: Datos del socio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Socio'
 *       404:
 *         description: Socio no encontrado
 */
router.get('/:dni', sociosController.getOne);

/**
 * @swagger
 * /api/socios:
 *   post:
 *     summary: Crear un nuevo socio
 *     tags: [Socios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Socio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Socio'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El socio ya existe
 */
router.post('/', upload.single('foto'), validate(createSocioSchema), sociosController.create);

/**
 * @swagger
 * /api/socios/{dni}:
 *   put:
 *     summary: Actualizar un socio
 *     tags: [Socios]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Socio'
 *     responses:
 *       200:
 *         description: Socio actualizado
 *       404:
 *         description: Socio no encontrado
 */
router.put('/:dni', upload.single('foto'), validate(updateSocioSchema), sociosController.update);

/**
 * @swagger
 * /api/socios/{dni}:
 *   delete:
 *     summary: Eliminar un socio
 *     tags: [Socios]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Socio eliminado
 *       404:
 *         description: Socio no encontrado
 */
router.delete('/:dni', sociosController.delete);

/**
 * @swagger
 * /api/socios/{dni}/restore:
 *   post:
 *     summary: Restaurar un socio eliminado
 *     tags: [Socios]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Socio restaurado
 *       404:
 *         description: Socio no encontrado
 */
router.post('/:dni/restore', sociosController.restore);

export default router;
