import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Public } from 'src/decorators/public.decorator';
import aqp from 'api-query-params';
import { IUser } from './users.interface';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { password, ...rest } = createUserDto

    const isExist = await this.userModel.findOne({ email: createUserDto.email })

    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại. Vui lòng đăng ký Email khác.`)
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userModel.create({
      ...rest,
      password: hashedPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })


    return {
      data: {
        _id: createdUser.id,
        createdAt: createdUser.createdAt
      }
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { password, ...rest } = registerUserDto

    const isExist = await this.userModel.findOne({ email: registerUserDto.email })

    if (isExist) {
      throw new BadRequestException(`Email ${registerUserDto.email} đã tồn tại. Vui lòng đăng ký Email khác.`)
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const role = "USER"

    const createdUser = await this.userModel.create({ ...rest, password: hashedPassword, role })
    return createdUser
  }


  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.page

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // using mongoose regular expression
    // const result = await this.companyModel.find({ name: { $regex: 'vin', $options: 'i' } })

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .sort(sort)
      .select('-password')



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
      return 'User not found'
    }

    const user = await this.userModel.findOne({ _id: id }).select('-password').lean()

    return {
      data: user
    }
  }

  async findOneByUsername(username: string) {

    const user = await this.userModel.findOne({ email: username })

    return user
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updatedUser = await this.userModel.updateOne({ _id: updateUserDto._id }
      ,
      {
        updatedBy: {
          _id: user._id,
          name: user.name
        },
        ...updateUserDto
      })
    return {
      data: {
        updatedUser
      }
    }
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }
    const deleteUserById = await this.userModel.findOneAndUpdate({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    })
    const results = await this.userModel.softDelete({ _id: id })
    return {
      data: results
    }
  }

  setRefreshToken = async (refresh_token: string, _id: string) => {
    return await this.userModel.findOneAndUpdate({
      _id
    },
      { refreshToken: refresh_token }
    )
  }
}
