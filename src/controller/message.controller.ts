import { Request, Response } from "express";
import { Message } from "../entities/message.entity";
import socket from "../config/socketServer.config";
import { ChatService } from "../services/chatRoom.services";
import { AuthService } from "../services/auth.services";
import { MessageService } from "../services/message.services";
import { AppDataSource } from "../config/db.config";

class MessageController {
  constructor(
    private readonly messageRepo = AppDataSource.getRepository(Message),
    private readonly messageService = new MessageService(),
    private readonly chatService = new ChatService(),
    private readonly authService = new AuthService()
  ) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const { chatId, createdAt, message } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const chat = await this.chatService.findChatById(chatId);
      console.log(chat);
      const recipient = chat.participants.find(
        (participant) => participant.id !== userId
      );

      if (!recipient) {
        return res
          .status(400)
          .json({ message: "Receiver not found in the chat" });
      }

      const sender = await this.authService.findAuthById(userId);
      const receiver = await this.authService.findAuthById(recipient.id);

      const newMessage = await this.messageService.create({
        message,
        sender,
        receiver,
        createdAt,
        chat,
      });

      const recipientSocketId = socket.getSocketIdForConnectedUser(receiver.id);
      const senderSocketId = socket.getSocketIdForConnectedUser(sender.id);
      console.log(recipientSocketId);
      if (recipientSocketId && senderSocketId) {
        const io = socket.get();
        io.to(recipientSocketId).emit("receive-message", newMessage);
        io.to(recipientSocketId).emit("chat-list", {
          ...newMessage,
          type: "received",
        });
        io.to(senderSocketId).emit("chat-list", {
          ...newMessage,
          type: "sent",
        });
      }

      return res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred", error: err });
    }
  }

  async getMessages(req: Request, res: Response) {
    const chatId = parseInt(req.query.chatId as string, 10);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid or missing chatId" });
    }

    try {
      const allMessages = await this.messageService.findAllMessageOfChatId(
        chatId
      );

      const messages = allMessages.map((message) => {
        if (message.sender.id === req.user?.id) {
          return { ...message, type: "sent" };
        } else {
          return { ...message, type: "received" };
        }
      });

      const responseMessage = messages.map((message) => {
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

      return res.status(200).json(responseMessage);
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
      const user = await this.authService.findAuthById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const chatIdList = await this.chatService.getChatIdListOfUser(userId);

      if (chatIdList.length === 0) {
        return res.status(200).json([]);
      }

      const chatListWithLastMessage = await this.messageService.getChatListWithLastMessage(chatIdList);
      const formattedMessages = chatListWithLastMessage
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

  async changeSeenStatusOfMessage(req: Request, res: Response) {
    try {
      console.log("status");
      const { chatId } = req.body;

      if (!chatId)
        return res.status(404).json({ message: "Insufficient request" });

      const message = await this.messageService.getLastMessageOfChatId(chatId)
      message.isSeen = true;
      await this.messageService.update(message);

      const messages = await this.messageService.getAllUnseenMessagesOfChatId(chatId);
      messages.forEach(async (message) => {
        message.isSeen = true;
        await this.messageRepo.save(message);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new MessageController();
