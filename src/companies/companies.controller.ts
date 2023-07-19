import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Version } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { User } from 'src/decorators/user.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }


  @Post()
  @ResponseMessage("Create a company")
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }


  @Public()
  @Get()
  @ResponseMessage("Fetch list companies with pagination")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {

    return this.companiesService.findAll(+limit, +page, queryString);
  }



  @Public()
  @Get(':id')
  @ResponseMessage("Fetch a company by ID")
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a company")
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }


  @Delete(':id')
  @ResponseMessage("Delete a company")

  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
