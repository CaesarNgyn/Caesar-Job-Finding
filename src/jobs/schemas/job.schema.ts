import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument, SchemaTimestampsConfig } from 'mongoose';


export type JobDocument = HydratedDocument<Job> & SchemaTimestampsConfig;

@Schema({ timestamps: true })
export class Job {

  @Prop()
  name: string;

  @Prop()
  skills: string[];


  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    logo: string
  }

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  //INTERN/FRESHER/JUNIOR/SENIOR
  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop()
  isActive: boolean;


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

export const JobSchema = SchemaFactory.createForClass(Job);