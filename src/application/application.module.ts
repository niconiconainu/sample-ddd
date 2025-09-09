import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { GetUserUseCase } from './usecase/get-user.usecase';
import { UpdateUserUseCase } from './usecase/update-user.usecase';
import { DeleteUserUseCase } from './usecase/delete-user.usecase';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class ApplicationModule {}