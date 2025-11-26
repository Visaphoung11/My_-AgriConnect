import { Router } from "express";
import {
  assignRoleToUser,
  removeRoleFromUser,
} from "@/controllers/userRoleController";
import { roleCheck } from "@/middlewares/roleMiddleware";
import { UserRole } from "@/enum";

const router = Router();

/**
 * @swagger
 * /api/v1/user-roles:
 *   post:
 *     summary: Assign a role to a user (Admin only)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRoleRequest'
 *     responses:
 *       201:
 *         description: Role assigned to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role assigned to user successfully"
 *                 userRole:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     roleId:
 *                       type: string
 *                     assignedAt:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     roleName:
 *                       type: string
 *       400:
 *         description: Bad request - role already assigned or invalid data
 *       404:
 *         description: User or role not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", roleCheck([UserRole.ADMIN]), assignRoleToUser);

/**
 * @swagger
 * /api/v1/user-roles:
 *   delete:
 *     summary: Remove a role from a user (Admin only)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRoleRequest'
 *     responses:
 *       200:
 *         description: Role removed from user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role removed from user successfully"
 *       404:
 *         description: Role assignment not found
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/", roleCheck([UserRole.ADMIN]), removeRoleFromUser);


export default router;
