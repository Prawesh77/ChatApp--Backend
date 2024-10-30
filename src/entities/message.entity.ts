import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Auth } from "./auth.entity";
import { Room } from "./room.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Auth, (auth) => auth.messages)
  user: Auth;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room
}
