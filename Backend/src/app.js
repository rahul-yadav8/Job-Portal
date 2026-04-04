import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./config/db.js";
import AuthRoutes from "../src/routes/AuthRoutes.js";
import UserRoutes from "../src/routes/UserRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
connectDb();

// Allow your frontend to access backend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you are sending cookies
  }),
);

app.use(express.json());

// apis
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
