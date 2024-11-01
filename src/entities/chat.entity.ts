import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auth } from "./auth.entity";
import { Message } from "./message.entity";

@Entity("chat")
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Auth)
  @JoinTable()
  participants: Auth[];
  
  @OneToMany(()=>Message, message=>message.chat)
  message: Message;
}
