import { Router } from "express";
import {
  createRole,
  getAllRoles,
} from "@/controllers/roleController";
import { roleCheck } from "@/middlewares/roleMiddleware";
import { UserRole } from "@/enum";
const router = Router();

// Apply authentication middleware to all routes
router.use(roleCheck([UserRole.ADMIN]));

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       '201':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       '400':
 *         description: Bad request - Role with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", roleCheck([UserRole.ADMIN]), createRole);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: List all roles (Admin or Staff)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Roles retrieved successfully"
 *                 count:
 *                   type: number
 *                   example: 5
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Staff access required
 */
router.get("/", getAllRoles);







export default router;
