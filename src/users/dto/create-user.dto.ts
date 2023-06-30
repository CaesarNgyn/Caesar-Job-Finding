import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({
    message: 'Email không được để trống!'
  })
  email: string;

  @IsNotEmpty({
    message: 'Password không được để trống!'
  })
  password: string;
  name: string;
  age: number;
  address: string;
  phone: string;
}