import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { USER_MODEL } from '../../constants/constants';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<User>) {}

  async createUser(userData: any): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    // Implement password validation logic (e.g., compare hashed passwords)
    return password === hashedPassword;
  }
}
