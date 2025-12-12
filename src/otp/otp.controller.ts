// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { OtpService } from './otp.service';
// import { CreateOtpDto } from './dto/create-otp.dto';
// import { UpdateOtpDto } from './dto/update-otp.dto';

// @Controller('otp')
// export class OtpController {
//   constructor(private readonly otpService: OtpService) {}

//   @Post()
//   create(@Body() createOtpDto: CreateOtpDto) {
//     return this.otpService.create(createOtpDto);
//   }

//   @Get()
//   findAll() {
//     return this.otpService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.otpService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateOtpDto: UpdateOtpDto) {
//     return this.otpService.update(+id, updateOtpDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.otpService.remove(+id);
//   }
// }

import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('send')
  async send(@Body() body: { phone: string }) {
    const res = await this.otpService.sendOTP(body.phone);
    return { success: true, status: res.status };
  }

  @Post('verify')
  async verify(@Body() body: { phone: string; code: string }) {
    const res = await this.otpService.verifyOTP(body.phone, body.code);
    return {
      success: res.valid,
      status: res.status,
      message: res.valid ? 'OTP Verified' : 'Invalid OTP',
    };
  }
}
