import { Router } from 'express';
import {
  getUserOrders,
  checkout,
} from '../controllers/orderController';
import { authenticate, roleCheck } from '@/middlewares/roleMiddleware';
import { UserRole } from '@/enum';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     summary: Checkout cart and create order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phone
 *               - address
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Customer's full name
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *                 example: "+85512345678"
 *               address:
 *                 type: string
 *                 description: Delivery address
 *                 example: "123 Street, Phnom Penh, Cambodia"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: Created order details
 *       400:
 *         description: Cart is empty or invalid shipping details
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/checkout', checkout);

/**
 * @swagger
 * /api/v1/orders/my:
 *   get:
 *     summary: Get current user's orders [OrderItems]
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Order details
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my', getUserOrders);




export default router;
