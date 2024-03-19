import { Body, Controller, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginCredentials, RegisterDTO } from './auth-interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: RegisterDTO) {
    try {
      const user = await this.authService.register(userData);
      return { message: 'User registered successfully', user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('login')
  async login(@Body() credentials: LoginCredentials) {
    try {
      const data = await this.authService.login(credentials);
      return { data };
    } catch (error) {
      // Return a meaningful error response with the appropriate status code
      throw new UnauthorizedException('Invalid username or password');
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
