import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import { Permission } from "src/permissions/schemas/permission.schema";

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'Description không được để trống!' })
  description: string;

  @IsNotEmpty({ message: 'isActive không được để trống!' })
  isActive: boolean;

  @IsArray({ message: 'Permissions phải có định dạng array!' })
  @IsNotEmpty({ message: 'Permissions không được để trống!' })
  @ArrayNotEmpty({ message: 'Permissions không được để trống!' })
  @IsMongoId({ each: true, message: 'Giá trị các phần tử của Permissions phải là mongo ID' })
  permissions: Permission[];

}
