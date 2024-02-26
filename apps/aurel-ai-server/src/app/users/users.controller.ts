import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: any) {
    try {
      await this.usersService.createUser(userData);
      return { message: 'User created successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('find-by-email')
  async findByEmail(@Body() emailData: any) {
    try {
      const user = await this.usersService.findByEmail(emailData.email);
      return { user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('validate-password')
  async validatePassword(@Body() passwordData: any) {
    try {
      const isValid = await this.usersService.validatePassword(
        passwordData.password,
        passwordData.hashedPassword
      );
      return { isValid };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('find-by-id')
  async findById(@Body() userIdData: any) {
    try {
      const user = await this.usersService.findById(userIdData.userId);
      return { user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('get-all-users')
  async getAllUsers() {
    try {
      const users = await this.usersService.getAllUsers();
      return { users };
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
