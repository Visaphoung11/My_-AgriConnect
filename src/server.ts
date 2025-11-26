import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import router from "./routes/index";
import { seedAdminUser } from "@/scripts/seedAdmin";
dotenv.config();
const app = express();

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/config/swagger";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();
seedAdminUser();

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", router); // existing routes

// Error handling
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
