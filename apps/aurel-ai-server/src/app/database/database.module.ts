import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { CustomConfigModule } from '../../config/config.module';
@Module({
  imports: [CustomConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
