import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface UserType {
    name: string;
    email: string;
    org: 'vinoth' | 'vijay' | 'johny';
    osId?: string;
    subscriptions?: { id: string, token: string, type: string }[];
}

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string

  @Prop({ type: String, required: true, enum: ['vinoth', 'vijay', 'johny'] })
  org: 'vinoth' | 'vijay' | 'johny'

  @Prop({ type: String, required: false, default: '' })
  osId?: string

  subscriptions?: { id: string, token: string, type: string }[]
}

export const UserSchema = SchemaFactory.createForClass(User);