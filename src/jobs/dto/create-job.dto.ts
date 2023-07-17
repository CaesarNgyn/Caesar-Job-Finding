import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";


class Company {
  @IsNotEmpty({ message: 'ID không được để trống!' })
  _id: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'Skills không được để trống!' })
  skills: string[];


  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;


  @IsNotEmpty({ message: 'Location không được để trống!' })
  location: string;

  @IsNotEmpty({ message: 'Salary không được để trống!' })
  salary: number;


  @IsNotEmpty({ message: 'Quantity không được để trống!' })
  quantity: number;


  @IsNotEmpty({ message: 'Level không được để trống!' })
  level: string;

  @IsNotEmpty({ message: 'Description không được để trống!' })
  description: string;

  @IsNotEmpty({ message: 'Start Date không được để trống!' })
  startDate: Date;

  @IsNotEmpty({ message: 'End Date không được để trống!' })
  endDate: Date;

  @IsNotEmpty({ message: 'isActive không được để trống!' })
  isActive: boolean;


}
