import { Request, Response } from "express";
import { AppDataSource } from "../config/db.config";
import { Auth } from "../entities/auth.entity";
import { Message } from "../entities/message.entity";

class ChatController {
  
constructor(
  private readonly authRepo = AppDataSource.getRepository(Auth),
  private readonly messageRepo = AppDataSource.getRepository(Message)
) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const { senderId, recipientId, message } = req.body;
      if (!senderId || !recipientId || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const sender = await this.authRepo.findOne({
        where: { id: senderId },
      });
      const receiver = await this.authRepo.findOne({
        where: { id: recipientId },
      });

      const newMessage = new Message();
      newMessage.message = message;
      newMessage.sender = sender!;
      newMessage.receiver = receiver!;

      await this.messageRepo.save(newMessage);
      return res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
      console.log(err);
    }
  }

  async getMessages(req: Request, res: Response) {
    const chatId = parseInt(req.query.chatId as string, 10);
  console.log(typeof chatId)
    if (isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid or missing chatId" });
    }
  
    try {
      const allMessages = await this.messageRepo.find({
        where: { chat: { id: chatId } },
        relations: ["sender", "receiver"],
        order: { createdAt: "ASC" }, // Optional: Order messages by createdAt
      });
  
      if (allMessages.length === 0) {
        return res.status(404).json({ message: "No messages found for this chat" });
      }
      
const messages = allMessages.map((message) => {
  if (message.sender.id === req.user?.id) {
    return { ...message, type: "sent" };
  } else {
    return { ...message, type: "received" };
  }
});

const sanitizedMessages = messages.map((message) => {
  return {
    id: message.id,
    message: message.message,
    createdAt: message.createdAt,
    isSeen: message.isSeen,
    type: message.type,
    sender:message.sender.email,
    receiver: message.receiver.email,
  };
});

      return res.status(200).json(sanitizedMessages);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve messages", error });
    }
  }
  

  async getChatListWithLastMessage(req: Request, res: Response) {
    // const messageRepo = AppDataSource.getRepository(Message)
    
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(userId);
    try {
      const chatList = await this.messageRepo
        .createQueryBuilder('message')
        .select([
          "message.id",
          "message.message",
          "message.createdAt",
          "message.isSeen",
          "sender.id",
          "sender.email",
          "receiver.id",
          "receiver.email",
          "chat.id"
        ])
        .leftJoin("message.sender", "sender")
        .leftJoin("message.receiver", "receiver")
        .leftJoin("message.chat", "chat")
        .where("message.senderId = :userId OR message.receiverId = :userId", {
          userId,
        })
        .orderBy("message.createdAt", "DESC")
        .getMany();
      console.log("chatList", chatList);
      const chatLists = chatList.map((chat) => {
        if (chat.sender.id === userId) {
          return {...chat, type: 'sent'}
        }else{
          return {...chat, type: 'received'}
        }
      })

      res.status(200).json(chatLists);

    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
      console.log("Error on chatList", error);
    }
  }
}

export default new ChatController();
