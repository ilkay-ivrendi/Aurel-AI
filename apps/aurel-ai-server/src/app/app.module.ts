import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';
import { CustomConfigModule } from '../config/config.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, ChatModule, CustomConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
