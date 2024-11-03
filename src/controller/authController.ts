import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config";
import { AuthService } from "../services/auth.services";
import HttpException from "../utils/httpException.utils";
import { Message } from "../constant/messages";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    await this.authService.doesUserExists(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authService.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.authService.findUserByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw HttpException.notFound(Message.invalidCredentials);

    const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: "2d" });

    res.json({ token });
  };
}
