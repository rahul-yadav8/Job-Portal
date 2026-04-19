import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./config/db.js";
import UserRoutes from "../src/routes/UserRoutes.js";
import companyRoutes from "../src/routes/companyRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectDb();

// Allow your frontend to access backend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you are sending cookies
  }),
);

// apis
app.use("/api/users", UserRoutes);
app.use("/api/company", companyRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
