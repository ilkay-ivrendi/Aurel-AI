import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  @UseGuards(JwtAuthGuard)
  @Post()
  async postChat(@Body() userData: any) {
    return "send post request";
  }
}
