import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Email } from '../vo/email.vo';
import { UserId } from '../vo/user-id.vo';
import { UserRepositoryInterface } from '../repository/user.repository.interface';

@Injectable()
export class UserDomainService {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  // リポジトリアクセスメソッド（ユースケースはこれらを使う）
  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async findUserById(id: UserId): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findUserByEmail(email: Email): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async deleteUser(id: UserId): Promise<void> {
    await this.userRepository.delete(id);
  }

  // ドメインロジックメソッド
  async checkEmailUniqueness(email: Email, excludeUserId?: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (!existingUser) {
      return true;
    }
    
    if (excludeUserId && existingUser.getId().getValue() === excludeUserId) {
      return true;
    }
    
    return false;
  }

  async canDeleteUser(user: User): Promise<boolean> {
    // Business logic to check if user can be deleted
    // For example, check if user has active subscriptions, pending orders, etc.
    
    if (user.getStatus().isDeleted()) {
      return false;
    }
    
    // Add more business rules here
    // For this example, we'll allow deletion if user is not already deleted
    return true;
  }

  calculateUserScore(user: User): number {
    // Example domain logic for calculating user score based on various factors
    let score = 100;
    
    const accountAge = this.calculateAccountAgeInDays(user);
    if (accountAge > 365) {
      score += 50;
    } else if (accountAge > 90) {
      score += 25;
    }
    
    if (user.getStatus().isActive()) {
      score += 20;
    }
    
    return score;
  }

  private calculateAccountAgeInDays(user: User): number {
    const now = new Date();
    const createdAt = user.getCreatedAt();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}