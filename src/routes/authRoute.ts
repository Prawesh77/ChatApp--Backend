import express from "express";
import { AuthController } from "../controller/authController";
import { catchAsync } from "../utils/catchAsync.utils";

const router = express.Router();
const authController = new AuthController

router.post("/login", catchAsync ,authController.login);
router.post("/register", catchAsync, authController.register);

export default router;