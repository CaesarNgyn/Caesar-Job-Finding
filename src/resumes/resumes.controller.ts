import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {
  }

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCVDto: CreateUserCVDto, @User() user: IUser) {
    return this.resumesService.create(createUserCVDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list Resumes with paginate")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {
    return this.resumesService.findAll(+limit, +page, queryString);
  }


  @Get(':id')
  @ResponseMessage('Fetch a Resume by ID')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('by-user')
  @ResponseMessage('Get Resume by User')
  findOneByUser(@User() user: IUser) {
    return this.resumesService.findOneByUser(user);
  }

  @Patch(':id')
  @ResponseMessage('Update status Resume')
  update(
    @Param('id') id: string,
    @Body("status") status: string,
    @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }


  @Delete(':id')
  @ResponseMessage('Delete a Resume')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }



}
