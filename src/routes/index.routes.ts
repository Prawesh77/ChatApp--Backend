import { Router } from "express";
import authRoute from "./auth.route";
import messageRoute from "./message.route";

const router = Router();

router.use("/", authRoute);
router.use("/chat", messageRoute);

export default router;