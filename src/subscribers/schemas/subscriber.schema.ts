import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument, SchemaTimestampsConfig } from 'mongoose';


export type SubscriberDocument = HydratedDocument<Subscriber> & SchemaTimestampsConfig;

@Schema({ timestamps: true })
export class Subscriber {

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];


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

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);