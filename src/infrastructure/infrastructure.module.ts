import { Module, Global } from '@nestjs/common';
import { InMemoryUserRepository } from './repository/in-memory-user.repository';
import { ExternalApiClient } from './client/external-api.client';
import { UserRepositoryInterface } from '@domain/repository/user.repository.interface';

@Global()
@Module({
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: InMemoryUserRepository,
    },
    InMemoryUserRepository,
    ExternalApiClient,
  ],
  exports: [
    UserRepositoryInterface,
    ExternalApiClient,
  ],
})
export class InfrastructureModule {}