# FatController アンチパターンの解説

## 概要

FatController（太ったコントローラー）は、MVCパターンにおける典型的なアンチパターンです。コントローラーが本来の責務を超えて、ビジネスロジック、データアクセス、外部連携などすべての処理を含んでしまう状態を指します。

## FatControllerの特徴

### 1. 複数の責務を持つ
```typescript
// 悪い例：1つのメソッドで複数の責務を持つ
async create(@Body() request: any): Promise<any> {
  // 1. バリデーション（本来はDTOやPipe）
  if (!request.name) { ... }
  
  // 2. ビジネスロジック（本来はドメイン層）
  const emailExists = this.checkEmail(request.email);
  
  // 3. データ生成（本来はエンティティ）
  const user = { id: this.generateId(), ... };
  
  // 4. データ保存（本来はリポジトリ）
  this.users.set(user.id, user);
  
  // 5. スコア計算（本来はドメインサービス）
  const score = this.calculateScore(user);
  
  // 6. レスポンス変換（本来はファクトリー）
  return { ...user, score };
}
```

### 2. コードの重複
```typescript
// 悪い例：同じロジックが複数箇所に存在
// findOneメソッド内
let score = 100;
if (accountAge > 365) score += 50;

// findAllメソッド内（同じコード）
let score = 100;
if (accountAge > 365) score += 50;

// updateメソッド内（また同じコード）
let score = 100;
if (accountAge > 365) score += 50;
```

### 3. 外部依存の直接利用
```typescript
// 悪い例：コントローラーから直接外部APIを呼ぶ
async syncToExternal(@Param('id') id: string) {
  const response = await fetch('https://api.example.com/users', {
    headers: {
      'API-Key': 'hardcoded-api-key' // ハードコードされた認証情報
    }
  });
}
```

## 問題点

### 1. テストの困難さ
- 単体テストが書きにくい
- モックが複雑になる
- 外部依存が多い

### 2. 保守性の低下
- 変更の影響範囲が大きい
- コードの理解が困難
- デバッグが難しい

### 3. 再利用性の欠如
- ビジネスロジックが再利用できない
- 同じコードを複数箇所に書く必要がある

### 4. スケーラビリティの問題
- チーム開発で衝突が起きやすい
- 機能追加が困難

## 解決方法

### 1. レイヤー分離
```typescript
// 良い例：責務を適切に分離
@Controller('users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private responseFactory: UserResponseFactory
  ) {}
  
  @Post()
  async create(@Body() request: CreateUserRequest) {
    const result = await this.createUserUseCase.execute(request);
    return this.responseFactory.create(result);
  }
}
```

### 2. ビジネスロジックの移動
```typescript
// 良い例：ドメイン層にビジネスロジックを配置
export class UserDomainService {
  calculateUserScore(user: User): number {
    // スコア計算ロジック
  }
}
```

### 3. リポジトリパターンの使用
```typescript
// 良い例：データアクセスをリポジトリに分離
export class UserRepository implements UserRepositoryInterface {
  async save(user: User): Promise<void> {
    // データ保存ロジック
  }
}
```

## リファクタリング前後の比較

### Before（FatController）
- コントローラー：500行以上
- 責務：8つ以上
- テストコード：複雑で脆い
- 重複コード：多数

### After（Clean Architecture）
- コントローラー：50行以下
- 責務：1つ（HTTPリクエスト/レスポンス処理）
- テストコード：シンプルで堅牢
- 重複コード：なし

## まとめ

FatControllerは、初期の開発速度を上げるように見えますが、長期的には技術的負債となります。適切なレイヤー分離とクリーンアーキテクチャの原則に従うことで、保守性が高く、テスタブルで、拡張可能なアプリケーションを構築できます。