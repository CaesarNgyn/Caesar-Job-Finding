import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import aqp from 'api-query-params';
import { IUser } from './users.interface';
import { User } from 'src/decorators/user.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post()
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage("Fetch user with paginate")
  findAll(
    @Query() queryString: string,
    @Query("limit") limit: string,
    @Query("page") page: string
  ) {


    return this.usersService.findAll(+limit, +page, queryString);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch user by ID")

  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage("Update a  user")
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
