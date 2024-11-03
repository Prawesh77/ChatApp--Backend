import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Auth } from "./auth.entity";
import { ChatRoom as Chat } from "./chatRoom.entity";

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string

  @ManyToOne(() => Auth)
  sender: Auth

  @ManyToOne(() => Auth)
  receiver: Auth

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column({default: false})
  isSeen: boolean

  @ManyToOne(()=>Chat, chat => chat.message)
  chat: Chat
}
