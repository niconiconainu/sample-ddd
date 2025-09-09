import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

// アンチパターン: FatController - すべてのロジックがコントローラーに詰め込まれている
@Controller('bad-example/users')
export class FatUserController {
  // データベースの代わり（本来はリポジトリ層で管理すべき）
  private users: Map<string, any> = new Map();
  private userIdCounter = 1;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: any): Promise<any> {
    // バリデーション（本来はValidationPipeやDTOで行うべき）
    if (!request.name || typeof request.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    
    if (request.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }
    
    if (!request.email || typeof request.email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    
    // メールフォーマットチェック（本来は値オブジェクトで行うべき）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }
    
    // メール重複チェック（本来はドメインサービスで行うべき）
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === request.email.toLowerCase()) {
        throw new Error('Email already exists');
      }
    }
    
    // IDの生成（本来は値オブジェクトで行うべき）
    const userId = `user-${this.userIdCounter++}`;
    
    // ユーザーオブジェクトの作成（本来はエンティティで行うべき）
    const now = new Date();
    const user = {
      id: userId,
      name: request.name,
      email: request.email.toLowerCase(),
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    
    // データの保存（本来はリポジトリで行うべき）
    this.users.set(userId, user);
    
    // スコア計算（本来はドメインサービスで行うべき）
    let score = 100;
    const accountAge = this.calculateAccountAgeInDays(user.createdAt);
    if (accountAge > 365) {
      score += 50;
    } else if (accountAge > 90) {
      score += 25;
    }
    if (user.status === 'ACTIVE') {
      score += 20;
    }
    
    // レスポンスの作成（本来はファクトリーで行うべき）
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      score: score,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const results = [];
    
    // データの取得とレスポンス変換（本来は別レイヤーで行うべき）
    for (const user of this.users.values()) {
      // 各ユーザーのスコア計算（重複コード）
      let score = 100;
      const accountAge = this.calculateAccountAgeInDays(user.createdAt);
      if (accountAge > 365) {
        score += 50;
      } else if (accountAge > 90) {
        score += 25;
      }
      if (user.status === 'ACTIVE') {
        score += 20;
      }
      
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        score: score,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    }
    
    return results;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    // データの検索（本来はリポジトリで行うべき）
    const user = this.users.get(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // スコア計算（また重複コード）
    let score = 100;
    const accountAge = this.calculateAccountAgeInDays(user.createdAt);
    if (accountAge > 365) {
      score += 50;
    } else if (accountAge > 90) {
      score += 25;
    }
    if (user.status === 'ACTIVE') {
      score += 20;
    }
    
    // レスポンスの作成（重複コード）
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      score: score,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() request: any): Promise<any> {
    // データの検索（重複コード）
    const user = this.users.get(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // ステータスチェック（本来はエンティティで行うべき）
    if (user.status !== 'ACTIVE') {
      throw new Error('User cannot update profile in current status');
    }
    
    // バリデーション（重複コード）
    if (!request.name || typeof request.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    
    if (request.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }
    
    if (!request.email || typeof request.email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    
    // メールフォーマットチェック（重複コード）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }
    
    // メール重複チェック（重複コード、しかも効率が悪い）
    for (const [userId, otherUser] of this.users.entries()) {
      if (userId !== id && otherUser.email.toLowerCase() === request.email.toLowerCase()) {
        throw new Error('Email already exists');
      }
    }
    
    // データの更新（本来はエンティティで行うべき）
    user.name = request.name;
    user.email = request.email.toLowerCase();
    user.updatedAt = new Date();
    
    // スコア計算（さらに重複コード）
    let score = 100;
    const accountAge = this.calculateAccountAgeInDays(user.createdAt);
    if (accountAge > 365) {
      score += 50;
    } else if (accountAge > 90) {
      score += 25;
    }
    if (user.status === 'ACTIVE') {
      score += 20;
    }
    
    // レスポンスの作成（重複コード）
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      score: score,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    // データの検索（重複コード）
    const user = this.users.get(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // 削除可能かチェック（本来はドメインサービスで行うべき）
    if (user.status === 'DELETED') {
      throw new Error('User is already deleted');
    }
    
    // ここで本来は関連データのチェックなどが必要だが、
    // すべてコントローラーに書くと複雑になる
    
    // ソフトデリート（本来はエンティティで行うべき）
    user.status = 'DELETED';
    user.updatedAt = new Date();
  }

  // ヘルパーメソッド（本来はドメインサービスに置くべき）
  private calculateAccountAgeInDays(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // 外部API連携（本来はインフラ層に置くべき）
  @Post(':id/sync')
  async syncToExternal(@Param('id') id: string): Promise<any> {
    const user = this.users.get(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // 外部APIの呼び出し（本来はクライアントクラスで行うべき）
    try {
      // 実際のHTTPリクエストをここに直接書く（悪い例）
      const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': 'hardcoded-api-key', // ハードコードされた認証情報（最悪）
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          externalId: user.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync user');
      }
      
      const data = await response.json();
      
      // 結果をユーザーオブジェクトに直接保存（悪い例）
      user.externalId = data.id;
      user.lastSyncedAt = new Date();
      
      return {
        message: 'User synced successfully',
        externalId: data.id,
      };
    } catch (error) {
      // エラーハンドリングも不適切
      console.error('Sync error:', error);
      throw new Error('Sync failed');
    }
  }
}

/**
 * このFatControllerの問題点：
 * 
 * 1. 責務の混在:
 *    - ビジネスロジック（バリデーション、スコア計算）
 *    - データアクセス（保存、検索）
 *    - 外部API連携
 *    - レスポンス変換
 * 
 * 2. コードの重複:
 *    - バリデーションロジックの重複
 *    - スコア計算ロジックの重複
 *    - レスポンス作成の重複
 * 
 * 3. テストが困難:
 *    - 外部依存が多い
 *    - モックが作りにくい
 *    - 単体テストが書きにくい
 * 
 * 4. 保守性が低い:
 *    - 変更の影響範囲が大きい
 *    - ビジネスルールが散在
 *    - 再利用ができない
 * 
 * 5. セキュリティリスク:
 *    - APIキーのハードコード
 *    - 不適切なエラーハンドリング
 * 
 * 6. パフォーマンスの問題:
 *    - 非効率なループ処理
 *    - 不要な処理の繰り返し
 */