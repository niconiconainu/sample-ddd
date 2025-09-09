import { Injectable } from '@nestjs/common';
import { UserId } from '@domain/vo/user-id.vo';
import { UserDomainService } from '@domain/service/user.domain.service';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const id = new UserId(userId);
    const user = await this.userDomainService.findUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const score = this.userDomainService.calculateUserScore(user);

    return new UserResponseDto(
      user.getId().getValue(),
      user.getName(),
      user.getEmail().getValue(),
      user.getStatus().getValue(),
      score,
      user.getCreatedAt(),
      user.getUpdatedAt()
    );
  }

  async executeAll(): Promise<UserResponseDto[]> {
    const users = await this.userDomainService.findAllUsers();

    return users.map(user => {
      const score = this.userDomainService.calculateUserScore(user);
      return new UserResponseDto(
        user.getId().getValue(),
        user.getName(),
        user.getEmail().getValue(),
        user.getStatus().getValue(),
        score,
        user.getCreatedAt(),
        user.getUpdatedAt()
      );
    });
  }
}