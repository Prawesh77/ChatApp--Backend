import { AppDataSource } from "../config/db.config";
import { ChatRoom } from "../entities/chatRoom.entity";
import HttpException from "../utils/httpException.utils";

export class ChatService {
  constructor(
    private readonly chatRepo = AppDataSource.getRepository(ChatRoom)
  ) {}

  async findChatById(chatId: number) {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ["participants"],
    });

    if (!chat) {
      throw HttpException.notFound("Chat not found");
    }

    return chat;
  }

  async getChatIdListOfUser(userId: number) {
    const chats = await this.chatRepo
      .createQueryBuilder("chat")
      .leftJoin("chat.participants", "participant")
      .where("participant.id = :userId", { userId })
      .select("chat.id")
      .getMany();
    const chatIdList = chats.map((chat) => chat.id);
    return chatIdList;
  }
}
