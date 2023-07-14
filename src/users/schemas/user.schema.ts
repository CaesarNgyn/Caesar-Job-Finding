import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument, SchemaTimestampsConfig } from 'mongoose';


export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

@Schema({ timestamps: true })
export class User {

  @Prop()
  name: string;

  @Prop({
    unique: true,
    required: true

  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string
  }

  @Prop()
  role: string

  @Prop()
  refreshToken: string



  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }






}

export const UserSchema = SchemaFactory.createForClass(User);