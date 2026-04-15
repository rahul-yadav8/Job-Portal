import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  updateProfile,
  uploadAvatar,
} from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { upload } from "../middlewares/UploadMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.post("/upload-image", upload.single("avatar"), uploadAvatar);

router.put("/update-profile", authMiddleware, updateProfile);

router.get("/me", authMiddleware, getMe);

// router.delete("/resume", authMiddleware, deleteResume);

export default router;
