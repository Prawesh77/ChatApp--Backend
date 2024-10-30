import express from "express";
import { AuthController } from "../controller/authController";

const router = express.Router();
const authController = new AuthController

router.post("/login", authController.login);
router.post("/register", authController.register);

export default router;