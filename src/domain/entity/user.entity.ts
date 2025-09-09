import { UserId } from '../vo/user-id.vo';
import { Email } from '../vo/email.vo';
import { UserStatus } from '../vo/user-status.vo';
import dayjs from 'dayjs';

export class User {
  private readonly id: UserId;
  private name: string;
  private email: Email;
  private status: UserStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: UserId,
    name: string,
    email: Email,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.validateName(name);
    this.id = id;
    this.name = name;
    this.email = email;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('User name cannot exceed 100 characters');
    }
  }

  static create(name: string, email: string): User {
    const now = new Date();
    return new User(
      new UserId(),
      name,
      new Email(email),
      UserStatus.createActive(),
      now,
      now
    );
  }

  static reconstruct(
    id: string,
    name: string,
    email: string,
    status: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(
      new UserId(id),
      name,
      new Email(email),
      new UserStatus(status as any),
      createdAt,
      updatedAt
    );
  }

  updateProfile(name: string, email: string): void {
    if (!this.status.canPerformActions()) {
      throw new Error('User cannot update profile in current status');
    }
    this.validateName(name);
    this.name = name;
    this.email = new Email(email);
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.status.isActive()) {
      throw new Error('User is already active');
    }
    if (this.status.isDeleted()) {
      throw new Error('Cannot activate deleted user');
    }
    this.status = UserStatus.createActive();
    this.updatedAt = new Date();
  }

  suspend(): void {
    if (this.status.isSuspended()) {
      throw new Error('User is already suspended');
    }
    if (this.status.isDeleted()) {
      throw new Error('Cannot suspend deleted user');
    }
    this.status = new UserStatus(UserStatusType.SUSPENDED);
    this.updatedAt = new Date();
  }

  delete(): void {
    if (this.status.isDeleted()) {
      throw new Error('User is already deleted');
    }
    this.status = new UserStatus(UserStatusType.DELETED);
    this.updatedAt = new Date();
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  toObject(): {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id.getValue(),
      name: this.name,
      email: this.email.getValue(),
      status: this.status.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

import { UserStatusType } from '../vo/user-status.vo';