# DDDレイヤー構成の明確化

## リポジトリパターンの正しい理解

### Domain層とInfrastructure層の関係

```
Domain Layer
├── Entity (User)
├── Value Object (Email, UserId)
├── Domain Service (UserDomainService)
└── Repository Interface (UserRepositoryInterface) ← 抽象（インターフェース）

Infrastructure Layer
└── Repository Implementation (InMemoryUserRepository) ← 具体実装
    └── 実際のDBアクセス、クエリ実行
```

## 重要なポイント

### 1. Domain層にはインターフェースのみ

```typescript
// domain/repository/user.repository.interface.ts
export interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  // 抽象メソッドのみ定義
}
```

### 2. Infrastructure層に実装

```typescript
// infrastructure/repository/in-memory-user.repository.ts
@Injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    // 実際のデータ保存処理
    this.users.set(user.getId().getValue(), user);
  }
  
  // 本番環境では以下のような実装になる
  // async save(user: User): Promise<void> {
  //   const query = 'INSERT INTO users ...';
  //   await this.db.execute(query, [...]);
  // }
}
```

## 依存性逆転の原則（DIP）

このアーキテクチャは依存性逆転の原則を実現しています：

```
Application Layer (UseCase)
    ↓ depends on
Domain Layer (Service & Repository Interface)
    ↑ implements
Infrastructure Layer (Repository Implementation)
```

- 上位層（Domain）が抽象を定義
- 下位層（Infrastructure）が抽象を実装
- 依存の方向が逆転している

## 現在のアーキテクチャの利点

### 1. ドメインサービスがリポジトリインターフェースを使用

```typescript
export class UserDomainService {
  constructor(
    private readonly userRepository: UserRepositoryInterface
  ) {}
  
  // ドメインロジックとデータアクセスを統合
  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
```

### 2. ユースケースはドメインサービス経由でアクセス

```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService
  ) {}
  
  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // ドメインサービス経由でデータアクセス
    await this.userDomainService.saveUser(user);
  }
}
```

## なぜこの構成が良いのか

1. **テスタビリティ**: 各層を独立してテスト可能
2. **柔軟性**: DBを変更してもドメイン層に影響なし
3. **疎結合**: インターフェースを介した依存
4. **保守性**: 責務が明確に分離

## 実装の切り替え例

```typescript
// 開発環境
@Module({
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: InMemoryUserRepository, // メモリ実装
    },
  ],
})

// 本番環境
@Module({
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: PostgresUserRepository, // PostgreSQL実装
    },
  ],
})
```

## まとめ

- Domain層の`UserRepositoryInterface`は抽象定義
- Infrastructure層の`InMemoryUserRepository`は具体実装
- ドメインサービスがリポジトリインターフェースを使用するのは正しい
- ユースケースがドメインサービス経由でアクセスすることで、さらに疎結合を実現