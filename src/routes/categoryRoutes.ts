import { Router } from 'express';
import { 
  createCategory, 
  getCategories,
} from '../controllers/categoryController';
import { roleCheck } from '@/middlewares/roleMiddleware';
import { UserRole } from '@/enum';

const router = Router();

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Apply authentication middleware to all routes
router.use(roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER]));

router.get('/', getCategories);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category (Admin/Seller/Farmer only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *               description:
 *                 type: string
 *                 description: Description of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createCategory);

export default router;
