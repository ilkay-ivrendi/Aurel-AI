import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION, MONGO_AUTH_SOURCE, MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USER } from '../constants/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      const uri = `mongodb://${configService.get(
        MONGO_HOST
      )}:${configService.get(MONGO_PORT)}/${configService.get(
        MONGO_DATABASE
      )}`;
      const options = {
        authSource: configService.get(MONGO_AUTH_SOURCE),
        user: configService.get(MONGO_USER),
        pass: configService.get(MONGO_PASSWORD),
      };
      return await mongoose.connect(uri, options);
    },
  },
];
