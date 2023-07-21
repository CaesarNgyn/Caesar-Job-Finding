import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }


  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method, ...rest } = createPermissionDto
    const isExisted = await this.permissionModel.findOne({ apiPath, method })

    if (isExisted) {
      throw new BadRequestException(`apiPath=${createPermissionDto.apiPath} với method=${createPermissionDto.method} đã tồn tại.`)
    }

    const createdPermission = await this.permissionModel.create({
      apiPath,
      method,
      ...rest,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: createdPermission.id,
      createdAt: createdPermission.createdAt
    };
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // using mongoose regular expression
    // const result = await this.permissionModel.find({ name: { $regex: 'vin', $options: 'i' } })

    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)



    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Permission with ID ${id} not found`)
    }

    const permission = await this.permissionModel.findOne({ _id: id })

    return permission

  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Permission with ID ${id} not found`)
    }
    return await this.permissionModel.updateOne({ _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'permission not found'
    }

    await this.permissionModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    const deletepermissionById = await this.permissionModel.softDelete({ _id: id })
    return deletepermissionById
  }
}
