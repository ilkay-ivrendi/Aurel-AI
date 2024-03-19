import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Credentials, LoginCredentials, UserProfile } from './auth-interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(credentials: LoginCredentials): Promise<Credentials> {
    const user = await this.validateUser(credentials);
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { username: user.username, sub: user.id };
    const transformedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar ? user.avatar : `https://api.dicebear.com/8.x/adventurer/svg?seed=${user.id}`
    };

    return {
      access_token: this.jwtService.sign(payload),
      user_data: transformedUser,
    };
  }

  async register(userData: any): Promise<void> {
    // Check if user with provided email already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUserName = await this.usersService.findByUsername(
      userData.username
    );
    if (existingUserName) {
      throw new Error('User with this username already exists');
    }

    const hashPassword = await this.hashPassword(userData.password);
    userData.password = hashPassword;
    // Create new user
    await this.usersService.createUser(userData);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    // Implement logic to send password reset email
    // This could involve generating a password reset token and sending it via email
    // You might use a library like nodemailer to send emails
    // Example:
    // const passwordResetToken = generatePasswordResetToken();
    // const resetLink = `https://example.com/reset-password?token=${passwordResetToken}`;
    // sendEmail(email, 'Password Reset', `Click the following link to reset your password: ${resetLink}`);
  }

  async validateUser(credentials: LoginCredentials): Promise<any> {
    const user = await this.usersService.findByUsername(credentials.username);
    const validatePassword = await this.validatePassword(
      credentials.password,
      user.password
    );
    
    if (user && validatePassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Salt rounds for bcrypt hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
