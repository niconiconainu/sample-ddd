# リポジトリアクセスパターン

## 概要

このプロジェクトでは、より疎結合なアーキテクチャを実現するため、リポジトリへのアクセスをドメインサービス経由で行うパターンを採用しています。

## アーキテクチャの利点

### 1. 疎結合性の向上

```typescript
// Before: ユースケースがリポジトリを直接使用
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly userDomainService: UserDomainService
  ) {}
}

// After: ドメインサービス経由でのみアクセス
export class CreateUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}
}
```

### 2. 単一責任の原則

ドメインサービスがデータアクセスとビジネスロジックの両方を管理することで、関連する処理が一箇所に集約されます。

```typescript
export class UserDomainService {
  // データアクセスメソッド
  async saveUser(user: User): Promise<void> { }
  async findUserById(id: UserId): Promise<User | null> { }
  
  // ビジネスロジックメソッド
  async checkEmailUniqueness(email: Email): Promise<boolean> { }
  calculateUserScore(user: User): number { }
}
```

### 3. テストの容易性

ユースケースのテストでは、ドメインサービスのみをモックすれば良く、リポジトリのモックは不要になります。

```typescript
// テストコードの例
describe('CreateUserUseCase', () => {
  it('should create user', async () => {
    const mockDomainService = {
      checkEmailUniqueness: jest.fn().mockResolvedValue(true),
      saveUser: jest.fn(),
      calculateUserScore: jest.fn().mockReturnValue(100)
    };
    
    const useCase = new CreateUserUseCase(mockDomainService);
    // リポジトリのモックは不要
  });
});
```

## 実装パターン

### ドメインサービスの構成

```typescript
@Injectable()
export class UserDomainService {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  // 1. リポジトリアクセスメソッド（ユースケース用）
  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async findUserById(id: UserId): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  // 2. ドメインロジックメソッド
  async checkEmailUniqueness(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return !existingUser;
  }

  calculateUserScore(user: User): number {
    // ビジネスロジック
  }
}
```

### ユースケースの実装

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // ドメインサービス経由でのデータアクセス
    const user = await this.userDomainService.findUserById(id);
    
    // ドメインロジックの実行
    const score = this.userDomainService.calculateUserScore(user);
    
    // 保存もドメインサービス経由
    await this.userDomainService.saveUser(user);
  }
}
```

## トレードオフ

### 利点
- より高い疎結合性
- テストの簡素化
- ビジネスロジックとデータアクセスの統一的な管理
- 依存関係の削減

### 考慮点
- ドメインサービスが若干大きくなる
- 単純なデータアクセスでも一度ドメインサービスを経由する必要がある

## まとめ

このパターンにより、アプリケーション層（ユースケース）はドメイン層のサービスのみに依存し、インフラストラクチャ層（リポジトリ）への直接的な依存を排除できます。これにより、より保守性が高く、テスタブルなアーキテクチャを実現しています。