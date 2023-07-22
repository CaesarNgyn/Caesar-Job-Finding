import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'Skills không được để trống!' })
  @IsArray({ message: 'Skills phải có định dạng array!' })
  @IsString({ each: true, message: 'Skill có phần tử chỉ có định dạng là string' })
  skills: string[]
}
