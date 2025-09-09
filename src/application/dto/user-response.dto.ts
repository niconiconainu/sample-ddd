export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  status: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    status: string,
    score: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.status = status;
    this.score = score;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}