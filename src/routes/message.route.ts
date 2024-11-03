import express from "express";
import  messageController  from "../controller/message.controller";
import authentication from "../middleware/authentication.middleware";

const router = express.Router();

router.post("/send-message", authentication, messageController.sendMessage.bind(messageController));
router.get("/get-message", authentication, messageController.getMessages.bind(messageController));
router.get("/get-chat-list", authentication, messageController.getChatListWithLastMessage.bind(messageController));
router.patch("/seen-status", authentication, messageController.changeSeenStatusOfMessage.bind(messageController));

export default router;