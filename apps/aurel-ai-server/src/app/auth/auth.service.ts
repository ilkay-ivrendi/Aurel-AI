import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(credentials: any): Promise<any> {
    // Check if user with provided email exists
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate password
    const isValidPassword = await this.usersService.validatePassword(
      credentials.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate and return JWT token
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any): Promise<void> {
    // Check if user with provided email already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

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

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
