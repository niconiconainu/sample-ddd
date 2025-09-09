import { Injectable } from '@nestjs/common';
import { UserId } from '@domain/vo/user-id.vo';
import { UserDomainService } from '@domain/service/user.domain.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}

  async execute(userId: string): Promise<void> {
    const id = new UserId(userId);
    const user = await this.userDomainService.findUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const canDelete = await this.userDomainService.canDeleteUser(user);
    if (!canDelete) {
      throw new Error('User cannot be deleted');
    }

    // Mark user as deleted
    user.delete();

    // Save the deleted status through domain service
    await this.userDomainService.saveUser(user);
  }
}