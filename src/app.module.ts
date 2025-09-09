import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    InfrastructureModule,
    DomainModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}