import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Public } from 'src/auth/decorator/public.decorator';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userModel.create({ ...rest, password: hashedPassword })
    // const result = createdUser.save()
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    // const users = await User.find().select('-password').lean()
    const findAllUsers = await this.userModel.find({})
    return findAllUsers;
  }

  async findOne(id: string): Promise<User | string> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }

    const user = await this.userModel.findOne({ _id: id })

    return user
  }

  async findOneByUsername(username: string): Promise<User> {

    const user = await this.userModel.findOne({ email: username })
    // console.log(user)
    return user
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }
    const deleteUserById = await this.userModel.softDelete({ _id: id })
    return deleteUserById
  }
}
