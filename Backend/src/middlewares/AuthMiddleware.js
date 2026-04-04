import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { blacklistedTokens } from "../utils/blacklistedTokens.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    // 2. Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ message: "session has expired" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Get user from DB (optional but recommended)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 6. Attach user to request
    req.user = user;

    // 7. Continue
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
