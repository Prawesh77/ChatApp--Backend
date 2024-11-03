import { IMessage } from "../interfaces/message.interface";
import { AppDataSource } from "../config/db.config";
import { Message } from "../entities/message.entity";
import HttpException from "../utils/httpException.utils";

export class MessageService {
  constructor(
    private readonly messageRepo = AppDataSource.getRepository(Message)
  ) {}

  async create(data: IMessage) {
    const newMessage = new Message();
    newMessage.message = data.message;
    newMessage.sender = data.sender;
    newMessage.receiver = data.receiver;
    newMessage.createdAt = data.createdAt;
    newMessage.chat = data.chat;

    return await this.messageRepo.save(newMessage);
  }

  async findAllMessageOfChatId(chatId: number) {
    const allMessages = await this.messageRepo.find({
      where: { chat: { id: chatId } },
      relations: ["sender", "receiver"],
      order: { createdAt: "ASC" },
    });

    if (allMessages.length === 0)
      throw HttpException.notFound("No messages found for this chat");
    return allMessages;
  }

  async getChatListWithLastMessage(chatIdList: number[]) {
    const messages = await this.messageRepo
        .createQueryBuilder("message")
        .select([
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
      return lastMessages;
  }

  async getLastMessageOfChatId(chatId: number) {
    const message = await this.messageRepo.findOne({
        where: { chat: { id: chatId } },
        order: { createdAt: "DESC" },
      });

      if (!message) throw HttpException.notFound("No messages found for this chat");
      return message;
  }

  async update(message: Message){
    return await this.messageRepo.save(message);
  }

  async getAllUnseenMessagesOfChatId(chatId: number){
    const messages = await this.messageRepo.find({
        where: { isSeen: false, chat: { id: chatId } },
        order: { createdAt: "DESC" },
      });
    return messages;
  }
}
