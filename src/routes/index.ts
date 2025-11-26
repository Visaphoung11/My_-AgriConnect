import { Router } from "express";

import authRoute from "./authRoute";
import roleRoute from "./roleRoute";
import userRoleRoute from "./userRoleRoute";
import userRoute from "./userRoute";
import categoryRoute from "./categoryRoutes"
import productRoute from "./productRoutes"
import orderRoute from "./orderRoutes"
import cartRoute from "./cartRoutes"

const router = Router();

router.use("/auth", authRoute);
router.use("/roles", roleRoute);
router.use("/user-roles", userRoleRoute);
router.use("/users", userRoute);
router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/orders", orderRoute);
router.use("/cart", cartRoute);

export default router;
