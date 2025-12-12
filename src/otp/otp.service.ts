import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class OtpService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );
  }

  async sendOTP(phone: string) {
    return this.client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });
  }

  async verifyOTP(phone: string, code: string) {
    return this.client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phone,
        code,
      });
  }
}
