import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from 'src/users/users.interface';


@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const newCompany = {
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    }
    const createdCompany = await this.companyModel.create(newCompany)


    // const result = createdUser.save()
    return createdCompany;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne({ _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}