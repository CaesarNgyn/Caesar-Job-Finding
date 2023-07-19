import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, IsDate, ValidateNested, IsMongoId, IsArray } from 'class-validator';
import mongoose from 'mongoose';



export class CreateResumeDto {

  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'User ID không được để trống!' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'URL không được để trống!' })
  url: string;

  @IsNotEmpty({ message: 'Status không được để trống!' })
  status: string;

  @IsNotEmpty({ message: 'CompanyId không được để trống!' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'jobId không được để trống!' })
  jobId: mongoose.Schema.Types.ObjectId;


}


export class CreateUserCVDto {

  @IsNotEmpty({ message: 'URL không được để trống!' })
  url: string;


  @IsNotEmpty({ message: 'CompanyId không được để trống!' })
  @IsMongoId({ message: 'CompanyId phải có dạng mongo ID' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'jobId không được để trống!' })
  @IsMongoId({ message: 'jobId phải có dạng mongo ID' })
  jobId: mongoose.Schema.Types.ObjectId;

}