import { Injectable } from '@nestjs/common';
import { User } from '@domain/entity/user.entity';
import { Email } from '@domain/vo/email.vo';
import { UserDomainService } from '@domain/service/user.domain.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email is unique
    const email = new Email(dto.email);
    const isEmailUnique = await this.userDomainService.checkEmailUniqueness(email);
    
    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }

    // Create new user entity
    const user = User.create(dto.name, dto.email);

    // Save through domain service
    await this.userDomainService.saveUser(user);

    // Calculate user score
    const score = this.userDomainService.calculateUserScore(user);

    // Return response DTO
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
}