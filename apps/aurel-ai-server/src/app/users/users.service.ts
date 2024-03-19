import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repository';
import { Model } from 'mongoose';
import { User } from '../database/interfaces/user.interface';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor( @Inject('USER_MODEL')
  private userModel: Model<User>) {}

  async createUser(userDTO: CreateUserDto): Promise<any> {
    const createdUser = new this.userModel(userDTO);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<any> {
    try {
      // Find the user by username using the UserModel
      const user = await this.userModel.findOne({ email }).exec();
      return user; // Return the found user or null if not found
    } catch (error) {
      // Handle any errors (e.g., database connection errors)
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findByUsername(username: string): Promise<any> {
    try {
      // Find the user by username using the UserModel
      const user = await this.userModel.findOne({ username }).select('id username email password avatar').lean();
      return user; // Return the found user or null if not found
    } catch (error) {
      // Handle any errors (e.g., database connection errors)
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    // Implement validatePassword logic here
    return true;
  }

  async findById(userId: string): Promise<any> {
    // Implement findById logic here
  }

  async getAllUsers(): Promise<any[]> {
    // Implement getAllUsers logic here
    return [];
  }
}
