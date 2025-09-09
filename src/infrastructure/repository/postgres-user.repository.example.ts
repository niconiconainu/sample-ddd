import { Injectable } from '@nestjs/common';
import { User } from '@domain/entity/user.entity';
import { UserId } from '@domain/vo/user-id.vo';
import { Email } from '@domain/vo/email.vo';
import { UserRepositoryInterface } from '@domain/repository/user.repository.interface';

/**
 * PostgreSQL実装の例（実際のDBアクセスを行う）
 * これはInfrastructure層の実装例です
 */
@Injectable()
export class PostgresUserRepository implements UserRepositoryInterface {
  constructor(
    // 実際のDBクライアントを注入
    // private readonly db: DatabaseClient
  ) {}

  async save(user: User): Promise<void> {
    const userData = user.toObject();
    
    // 実際のSQL実行例
    /*
    const query = `
      INSERT INTO users (id, name, email, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = $2, 
        email = $3, 
        status = $4, 
        updated_at = $6
    `;
    
    await this.db.query(query, [
      userData.id,
      userData.name,
      userData.email,
      userData.status,
      userData.createdAt,
      userData.updatedAt
    ]);
    */
  }

  async findById(id: UserId): Promise<User | null> {
    // 実際のSQL実行例
    /*
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id.getValue()]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return User.reconstruct(
      row.id,
      row.name,
      row.email,
      row.status,
      row.created_at,
      row.updated_at
    );
    */
    
    return null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    // 実際のSQL実行例
    /*
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.db.query(query, [email.getValue()]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return User.reconstruct(
      row.id,
      row.name,
      row.email,
      row.status,
      row.created_at,
      row.updated_at
    );
    */
    
    return null;
  }

  async findAll(): Promise<User[]> {
    // 実際のSQL実行例
    /*
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.db.query(query);
    
    return result.rows.map(row => 
      User.reconstruct(
        row.id,
        row.name,
        row.email,
        row.status,
        row.created_at,
        row.updated_at
      )
    );
    */
    
    return [];
  }

  async delete(id: UserId): Promise<void> {
    // 物理削除の例（通常は論理削除を推奨）
    /*
    const query = 'DELETE FROM users WHERE id = $1';
    await this.db.query(query, [id.getValue()]);
    */
  }

  async exists(id: UserId): Promise<boolean> {
    // 存在確認のSQL
    /*
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)';
    const result = await this.db.query(query, [id.getValue()]);
    return result.rows[0].exists;
    */
    
    return false;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    // メールアドレスの存在確認
    /*
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await this.db.query(query, [email.getValue()]);
    return result.rows[0].exists;
    */
    
    return false;
  }
}

/**
 * このファイルが示すこと：
 * 
 * 1. リポジトリの実装はInfrastructure層に属する
 * 2. 実際のDBアクセス（SQLクエリ）はここで行う
 * 3. Domain層のインターフェースを実装している
 * 4. エンティティの永続化と再構築を担当
 * 5. DB固有の処理（トランザクション、最適化など）もここで実装
 */