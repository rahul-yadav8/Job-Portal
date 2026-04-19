import express from "express";
import {
  deleteCompany,
  getALlCompany,
  registerCompany,
  updateCompany,
} from "../controllers/companyController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, registerCompany);
router.get("/list", authMiddleware, getALlCompany);
router.put("/:id", authMiddleware, updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;
