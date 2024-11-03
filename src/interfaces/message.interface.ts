import { ChatRoom } from "../entities/chatRoom.entity";
import { Auth } from "../entities/auth.entity";

export interface IMessage {
    message: string;
    sender: Auth;
    receiver: Auth;
    createdAt: Date;
    chat: ChatRoom;
}