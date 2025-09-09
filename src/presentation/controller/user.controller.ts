import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserRequest } from '../dto/create-user.request';
import { UpdateUserRequest } from '../dto/update-user.request';
import { UserResponse } from '../dto/user.response';
import { UserResponseFactory } from '../factory/user-response.factory';
import { CreateUserUseCase } from '@application/usecase/create-user.usecase';
import { GetUserUseCase } from '@application/usecase/get-user.usecase';
import { UpdateUserUseCase } from '@application/usecase/update-user.usecase';
import { DeleteUserUseCase } from '@application/usecase/delete-user.usecase';
import { CreateUserDto } from '@application/dto/create-user.dto';
import { UpdateUserDto } from '@application/dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly userResponseFactory: UserResponseFactory
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) request: CreateUserRequest
  ): Promise<UserResponse> {
    const dto = new CreateUserDto(request.name, request.email);
    const result = await this.createUserUseCase.execute(dto);
    return this.userResponseFactory.create(result);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    const results = await this.getUserUseCase.executeAll();
    return this.userResponseFactory.createMany(results);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    const result = await this.getUserUseCase.execute(id);
    return this.userResponseFactory.create(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) request: UpdateUserRequest
  ): Promise<UserResponse> {
    const dto = new UpdateUserDto(id, request.name, request.email);
    const result = await this.updateUserUseCase.execute(dto);
    return this.userResponseFactory.create(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}