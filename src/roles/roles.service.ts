import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) { }


  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, ...rest } = createRoleDto
    const isExisted = await this.roleModel.findOne({ name })

    if (isExisted) {
      throw new BadRequestException(`Role với name="${createRoleDto.name}" đã tồn tại.`)
    }

    const createdRole = await this.roleModel.create({
      name,
      ...rest,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: createdRole.id,
      createdAt: createdRole.createdAt
    };
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // using mongoose regular expression
    // const result = await this.RoleModel.find({ name: { $regex: 'vin', $options: 'i' } })

    const result = await this.roleModel.find(filter)
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
      throw new BadRequestException(`Role with ID ${id} not found`)
    }

    const Role = await this.roleModel.findOne({ _id: id }).populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } })

    return Role

  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Role with ID ${id} not found`)
    }
    const { name, ...rest } = updateRoleDto

    return await this.roleModel.updateOne({ _id: id },
      {
        name,
        ...rest,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Role not found'
    }

    const foundRole = await this.roleModel.findById({ _id: id })
    if (foundRole.name === "ADMIN") {
      throw new BadRequestException('Không thể xóa role ADMIN')
    }

    await this.roleModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    const deleteRoleById = await this.roleModel.softDelete({ _id: id })
    return deleteRoleById
  }
}
