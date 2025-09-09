import { Injectable } from '@nestjs/common';
import { UserId } from '@domain/vo/user-id.vo';
import { Email } from '@domain/vo/email.vo';
import { UserDomainService } from '@domain/service/user.domain.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}

  async execute(dto: UpdateUserDto): Promise<UserResponseDto> {
    const userId = new UserId(dto.userId);
    const user = await this.userDomainService.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if new email is unique (excluding current user)
    const newEmail = new Email(dto.email);
    const isEmailUnique = await this.userDomainService.checkEmailUniqueness(
      newEmail,
      dto.userId
    );

    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }

    // Update user profile
    user.updateProfile(dto.name, dto.email);

    // Save changes through domain service
    await this.userDomainService.saveUser(user);

    // Calculate user score
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
}