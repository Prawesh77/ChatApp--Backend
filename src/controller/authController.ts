import { Request, Response } from "express";
import { AppDataSource } from "../config/db.config";
import { Auth as User } from "../entities/auth.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.config";


export class AuthController{
    register = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
      
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
      
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ email, password: hashedPassword });
        await userRepository.save(user);
      
        res.status(201).json({ message: "User registered" });
      };
      
      login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
      
        const user = await userRepository.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
      
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
      
        const token = jwt.sign({id : user.id}, JWT_SECRET!, { expiresIn: "2d" });
        res.json({ token });
      };   
}
