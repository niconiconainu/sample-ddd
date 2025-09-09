import { User } from '../entity/user.entity';
import { UserId } from '../vo/user-id.vo';
import { Email } from '../vo/email.vo';

export interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: UserId): Promise<void>;
  exists(id: UserId): Promise<boolean>;
  existsByEmail(email: Email): Promise<boolean>;
}