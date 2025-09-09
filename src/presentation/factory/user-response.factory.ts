import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '@application/dto/user-response.dto';
import { UserResponse } from '../dto/user.response';

@Injectable()
export class UserResponseFactory {
  create(dto: UserResponseDto): UserResponse {
    const response = new UserResponse();
    response.id = dto.id;
    response.name = dto.name;
    response.email = dto.email;
    response.status = dto.status;
    response.score = dto.score;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  createMany(dtos: UserResponseDto[]): UserResponse[] {
    return dtos.map(dto => this.create(dto));
  }
}