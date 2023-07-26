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
      to: "caesarngyn@gmail.com",
      from: '"From Caesar with love"', // override default from
      subject: 'Tuyển dụng việc làm',
      template: 'job.hbs', // HTML body content
    });
  }

}
