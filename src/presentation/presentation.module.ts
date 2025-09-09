import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { HealthController } from './controller/health.controller';
import { UserResponseFactory } from './factory/user-response.factory';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UserController, HealthController],
  providers: [UserResponseFactory],
})
export class PresentationModule {}