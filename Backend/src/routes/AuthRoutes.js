import express from "express";
import { register, login, getMe, uploadAvatar, logout } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { upload } from "../middlewares/UploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/upload-image", authMiddleware, upload.single("avatar"), uploadAvatar);
router.get("/logout", logout);

export default router;
