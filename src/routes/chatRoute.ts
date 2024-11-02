import express from "express";
import  chatController  from "../controller/chatController";
import authentication from "../middleware/authentication.middleware";

const router = express.Router();

router.post("/send-message", authentication, chatController.sendMessage.bind(chatController));
router.get("/get-message", authentication, chatController.getMessages.bind(chatController));
router.get("/get-chat-list", authentication, chatController.getChatListWithLastMessage.bind(chatController));
router.patch("/seen-status", authentication, chatController.changeSeenStatusOfMessage.bind(chatController));

export default router;