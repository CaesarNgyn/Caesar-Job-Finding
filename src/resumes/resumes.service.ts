import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }

  async create(createUserCVDto: CreateUserCVDto, user: IUser) {
    const { ...rest } = createUserCVDto

    const createdResume = await this.resumeModel.create({
      email: user.email,
      userId: user._id,
      status: "PENDING",
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      ...rest,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })


    return {

      _id: createdResume.id,
      createdAt: createdResume.createdAt

    };
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population, projection } = aqp(queryString)

    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .select(projection)


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
      return 'resume not found'
    }

    const resume = await this.resumeModel.findOne({ _id: id })

    return resume

  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('resume not found')
    }
    const updatedResume = await this.resumeModel.updateOne(
      { _id: id },
      {
        status: status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      }
    )

    return updatedResume

  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Resume not found'
    }

    await this.resumeModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    const deleteResumeById = await this.resumeModel.softDelete({ _id: id })
    return deleteResumeById
  }

  async findOneByUser(user: IUser) {

    const resume = await this.resumeModel.findById({ _id: user._id })

    return resume
  }
}
