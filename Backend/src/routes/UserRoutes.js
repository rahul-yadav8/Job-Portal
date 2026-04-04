import express from "express";
import { deleteResume, updateProfile } from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.put("/update-profile", authMiddleware, updateProfile);
router.delete("/resume", authMiddleware, deleteResume);

export default router;
