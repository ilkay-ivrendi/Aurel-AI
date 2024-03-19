
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: null }) 
  avatar: string;

  @Prop({ default: Date }) 
  birthday: Date;

  @Prop({ type: [{ type: String, enum: UserRole, default: [UserRole.USER] }] })
  user_roles: UserRole[];

  @Prop({ default: Date.now })
  created_at: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
