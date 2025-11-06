import { Request, Response } from "express";
import { authService } from "../services/authService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully.", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Server error during registration." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ message: "Login successful.", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Server error during login." });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const result = await authService.getMe(req.user.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error fetching user info." });
  }
};
