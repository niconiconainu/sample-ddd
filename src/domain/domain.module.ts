import { Module } from '@nestjs/common';
import { UserDomainService } from './service/user.domain.service';

@Module({
  providers: [UserDomainService],
  exports: [UserDomainService],
})
export class DomainModule {}