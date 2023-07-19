import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>
  ) { }
  async create(createJobDto: CreateJobDto, user: IUser) {
    const { ...rest } = createJobDto

    const createdJob = await this.jobModel.create({
      ...rest,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })


    return {

      _id: createdJob.id,
      createdAt: createdJob.createdAt

    };
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .sort(sort)




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
      return 'job not found'
    }

    const job = await this.jobModel.findOne({ _id: id })

    return job

  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return await this.jobModel.updateOne({ _id: id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Job not found'
    }

    await this.jobModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    const deleteJobById = await this.jobModel.softDelete({ _id: id })
    return deleteJobById
  }
}

