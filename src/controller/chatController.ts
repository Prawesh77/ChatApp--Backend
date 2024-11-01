import { Request, Response } from "express";
import { AppDataSource } from "../config/db.config";
import { Auth } from "../entities/auth.entity";
import { Message } from "../entities/message.entity";
import { Chat } from "../entities/chat.entity";

class ChatController {
  constructor(
    private readonly authRepo = AppDataSource.getRepository(Auth),
    private readonly messageRepo = AppDataSource.getRepository(Message),
    private readonly chatRepo = AppDataSource.getRepository(Chat)
  ) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const { chatId, message } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const chat = await this.chatRepo.findOne({
        where: { id: chatId },
        relations: ["participants"],
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const recepient = chat.participants.find(
        (participant) => participant.id !== userId
      );
      console.log(recepient);
      if (!recepient) {
        return res
          .status(400)
          .json({ message: "Receiver not found in the chat" });
      }

      const sender = await this.authRepo.findOne({ where: { id: userId } });
      const receiver = await this.authRepo.findOne({
        where: { id: recepient.id },
      });

      if (!sender || !receiver) {
        return res
          .status(404)
          .json({ message: "Sender or Receiver not found" });
      }

      const newMessage = new Message();
      newMessage.message = message;
      newMessage.sender = sender;
      newMessage.receiver = receiver;
      newMessage.chat = chat;

      await this.messageRepo.save(newMessage);

      return res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred", error: err });
    }
  }

  async getMessages(req: Request, res: Response) {
    const chatId = parseInt(req.query.chatId as string, 10);
    console.log(typeof chatId);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid or missing chatId" });
    }

    try {
      const allMessages = await this.messageRepo.find({
        where: { chat: { id: chatId } },
        relations: ["sender", "receiver"],
        order: { createdAt: "ASC" },
      });

      if (allMessages.length === 0) {
        return res
          .status(404)
          .json({ message: "No messages found for this chat" });
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
          sender: message.sender.email,
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
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await this.authRepo.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const chats = await this.chatRepo
        .createQueryBuilder("chat")
        .leftJoin("chat.participants", "participant")
        .where("participant.id = :userId", { userId })
        .select("chat.id")
        .getMany();

      const chatIdList = chats.map((chat) => chat.id);

      if (chatIdList.length === 0) {
        return res.status(200).json([]);
      }

      // Step 2: Find the last message in each chat
      const messages = await this.messageRepo
        .createQueryBuilder("message")
        .select([
          "message.id",
          "message.message",
          "message.createdAt",
          "message.isSeen",
          "sender.email",
          "receiver.email",
          "chat.id",
        ])
        .leftJoin("message.sender", "sender")
        .leftJoin("message.receiver", "receiver")
        .leftJoin("message.chat", "chat")
        .where("chat.id IN (:...chatIdList)", { chatIdList })
        .orderBy("message.createdAt", "DESC")
        .getMany();

      const lastMessages = chatIdList.map((chatId) => {
        return messages.find((message) => message.chat.id === chatId);
      });
      console.log(lastMessages);
      const formattedMessages = lastMessages
        .filter((chat) => chat !== undefined)
        .map((chat) => {
          const type = chat.sender.email === user.email ? "sent" : "received";
          return { ...chat, type };
        });

      res.status(200).json(formattedMessages);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
      console.log("Error on chatList", error);
    }
  }
}

export default new ChatController();
