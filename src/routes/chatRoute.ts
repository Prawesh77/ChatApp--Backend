import express from "express";
import { AuthController } from "../controller/authController";

const router = express.Router();
const authController = new AuthController

router.get("/send-message", authController.login);
router.post("/get-message", authController.register);

export default router;