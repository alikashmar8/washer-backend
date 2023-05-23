import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailData } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  send(data: MailData): void {
    this.mailerService
      .sendMail(data)
      .then((r) => {
        console.log("Email sending response:");
        console.log(r);
      })
      .catch((err) => {
        console.error(`sendMail - To: ${data.to}`, err.message, 'MailService');
      });
  }
}
