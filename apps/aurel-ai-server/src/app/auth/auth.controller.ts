import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    try {
      await this.authService.register(userData);
      return { message: 'User registered successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('login')
  async login(@Body() credentials: any) {
    try {
      const token = await this.authService.login(credentials);
      return { token };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() emailData: any) {
    try {
      await this.authService.sendPasswordResetEmail(emailData.email);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
