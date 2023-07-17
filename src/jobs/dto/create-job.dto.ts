import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested, IsString, IsDate, IsBoolean, IsArray } from "class-validator";
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
  @IsArray({ message: 'Skills phải có định dạng array!' })
  @ArrayNotEmpty({ message: 'Skills không được để trống!' })
  @IsString({ each: true, message: 'Skill chỉ có định dạng là string' })
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
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Start Date có định dạng Date!' })
  startDate: Date;


  @IsNotEmpty({ message: 'End Date không được để trống!' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'End Date có định dạng Date!' })
  endDate: Date;

  @IsNotEmpty({ message: 'isActive không được để trống!' })
  @IsBoolean({ message: 'Active chỉ nhận giá trị boolean' })
  isActive: boolean;


}
