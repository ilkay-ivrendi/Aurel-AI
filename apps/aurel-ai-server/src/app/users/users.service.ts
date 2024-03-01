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
    const createdCat = new this.userModel(userDTO);
    return createdCat.save();
  }

  async findByEmail(email: string): Promise<any> {
    // Implement findByEmail logic here
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
