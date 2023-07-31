import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Subscriber } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,

    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>

  ) { }




  @Get()
  @Public()
  @ResponseMessage("Send email")
  @Cron('0 0 0 * * 0') // 00:00 AM every Sunday
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length > 0) {
        const jobs = jobWithMatchingSkills.map((job, index) => {
          return {
            name: job.name,
            company: job.company.name,
            salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: job.skills
          }
        })
        await this.mailerService.sendMail({
          to: "caesarngyn@gmail.com",
          from: '"From Caesar with love"', // override default from
          subject: 'Tuyển dụng việc làm',
          template: 'job.hbs', // HTML body content
          context: {
            jobs,
            subName: subs.name
          }
        });
      }
    }
  }


}
