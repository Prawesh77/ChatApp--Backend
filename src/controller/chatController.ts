import { Request, Response } from "express";
import { AppDataSource } from "../config/db.config";
import { Message } from "../entities/message.entity";
import { Auth as User } from "../entities/auth.entity";

export const sendMessage = async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.user?.id;
  const messageRepository = AppDataSource.getRepository(Message);

  const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
  if (!user) return res.status(404).json({ message: "User not found" });

  const message = messageRepository.create({ content, user });
  await messageRepository.save(message);

  res.status(201).json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const messages = await AppDataSource.getRepository(Message).find({ relations: ["user"] });
  res.json(messages);
};
