import { MailerModule } from '@nestjs-modules/mailer';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { categoryFeature } from './features/category.feature';
import { mediaFeature } from './features/media.feature';
import { otpFeature } from './features/otp.feature';
import { tagFeature } from './features/tag.feature';
import { MediaRepository } from './repositories/media.repository';
import { OTPRepository } from './repositories/otp.repository';
import { CustomValidatorService } from './services/custom-validator.service';
import { MailService } from './services/mail.service';
import { MediaService } from './services/media.service';
import { MulterConfigService } from './services/multer-configuration.service';
import { OTPService } from './services/otp.service';
import { SMSService } from './services/sms.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationModule } from '../notification/notification.module';
import { DeviceModule } from '../device/device.module';
import { ServiceModule } from '../service/service.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(otpFeature),
    MongooseModule.forFeature(mediaFeature),
    MongooseModule.forFeature(tagFeature),
    MongooseModule.forFeature(categoryFeature),
    forwardRef(() => NotificationModule),
    forwardRef(() => DeviceModule),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [
    OTPService,
    OTPRepository,
    SMSService,
    MailService,
    MediaService,
    MediaRepository,
    MulterConfigService,
    /* CategoryService,
    CategoryRepository,
    TagService,
    TagRepository, */
    CustomValidatorService,
  ],
  controllers: [
    /* CategoryController, TagController */
  ],
  exports: [
    OTPService,
    SMSService,
    MailService,
    MediaService,
    MulterConfigService,
    /*     CategoryService,
    TagService, */
    CustomValidatorService,
  ],
})
export class UtilityModule {}
