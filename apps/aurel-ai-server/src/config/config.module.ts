// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${process.env.NODE_ENV || 'development'}`
    }),
  ],
  exports: [ConfigModule],
})
export class CustomConfigModule {}
