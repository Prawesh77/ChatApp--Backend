import { AppDataSource } from "../config/db.config";
import { Auth } from "../entities/auth.entity";
import HttpException from "../utils/httpException.utils";
import { Message, getNotFoundMessage } from "../constant/messages";
import { AuthData } from "../interfaces/auth.interface";

export class AuthService {
  constructor(private readonly authRepo = AppDataSource.getRepository(Auth)) {}


  async findAuthById(id:number){
    const user = await this.authRepo.findOne({ where: { id } });
    if (!user) throw HttpException.notFound(getNotFoundMessage("User"));
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.authRepo.findOne({ where: { email } });
    if (!user) throw HttpException.notFound(getNotFoundMessage("User"));
    return user;
  }

  async doesUserExists(email: string) {
    const existingUser = await this.authRepo.findOne({ where: { email } });
    if (existingUser) throw HttpException.conflict(Message.alreadyExist);
    return;
  }

  async create(data: AuthData) {
    const user = this.authRepo.create({
      email: data.email,
      password: data.password,
    });
    return await this.authRepo.save(user);

  }
}
