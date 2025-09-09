import { Injectable } from '@nestjs/common';
import { User } from '@domain/entity/user.entity';
import { UserId } from '@domain/vo/user-id.vo';
import { Email } from '@domain/vo/email.vo';
import { UserRepositoryInterface } from '@domain/repository/user.repository.interface';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.getId().getValue(), user);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = this.users.get(id.getValue());
    return user || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async delete(id: UserId): Promise<void> {
    this.users.delete(id.getValue());
  }

  async exists(id: UserId): Promise<boolean> {
    return this.users.has(id.getValue());
  }

  async existsByEmail(email: Email): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return true;
      }
    }
    return false;
  }
}