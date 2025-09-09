export enum UserStatusType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export class UserStatus {
  private readonly value: UserStatusType;

  constructor(value: UserStatusType) {
    this.value = value;
  }

  static createActive(): UserStatus {
    return new UserStatus(UserStatusType.ACTIVE);
  }

  static createInactive(): UserStatus {
    return new UserStatus(UserStatusType.INACTIVE);
  }

  getValue(): UserStatusType {
    return this.value;
  }

  isActive(): boolean {
    return this.value === UserStatusType.ACTIVE;
  }

  isSuspended(): boolean {
    return this.value === UserStatusType.SUSPENDED;
  }

  isDeleted(): boolean {
    return this.value === UserStatusType.DELETED;
  }

  canPerformActions(): boolean {
    return this.value === UserStatusType.ACTIVE;
  }

  equals(other: UserStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}