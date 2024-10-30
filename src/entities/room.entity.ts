import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./message.entity";
import { Auth } from "./auth.entity";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Auth)
  @JoinTable()
  participants: Auth[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
