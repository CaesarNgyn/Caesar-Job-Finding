import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "minhquan0411202@gmail.com",
      from: '"From Caesar with love" <support@example.com>', // override default from
      subject: 'Cho mq ngu',
      html: '<b>NestJS Caesar Nguyen test</b>', // HTML body content
    });
  }

}
