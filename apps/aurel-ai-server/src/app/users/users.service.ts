import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repository';

export type User = any;
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(userData: any): Promise<any> {
    // Implement createUser logic here
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

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
