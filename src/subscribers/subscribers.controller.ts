import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { Public, SkipCheckPermission } from 'src/decorators/public.decorator';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage('Create a new subscriber')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post("skills")
  @SkipCheckPermission()
  @ResponseMessage(`Get subscriber's skills`)
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }




  @Public()
  @Get()
  @ResponseMessage("Fetch list Subscribers with paginate")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {


    return this.subscribersService.findAll(+limit, +page, queryString);
  }


  @Public()
  @Get(':id')
  @ResponseMessage('Fetch a Subscriber by ID')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a Subscriber')
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Subscriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
