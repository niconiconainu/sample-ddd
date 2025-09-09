# Test DDD Project

This is a sample project demonstrating Domain-Driven Design (DDD) architecture with a 4-layer structure.

## Architecture Overview

This project follows a 4-layer DDD architecture:

### 1. Domain Layer (`src/domain/`)
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects without identity
- **Domain Services**: Business logic that doesn't belong to entities or value objects
- **Repository Interfaces**: Contracts for data persistence

### 2. Application Layer (`src/application/`)
- **Use Cases**: Application-specific business rules and orchestration
- **DTOs**: Data Transfer Objects for communication between layers

### 3. Infrastructure Layer (`src/infrastructure/`)
- **Repository Implementations**: Concrete implementations of repository interfaces
- **External Clients**: Integration with external services and APIs

### 4. Presentation Layer (`src/presentation/`)
- **Controllers**: HTTP request handlers
- **Request/Response DTOs**: API contract objects
- **Response Factories**: Transform domain objects to API responses

## Project Structure

```
test-ddd/
├── src/
│   ├── domain/
│   │   ├── entity/        # Domain entities
│   │   ├── vo/           # Value objects
│   │   ├── service/      # Domain services
│   │   └── repository/   # Repository interfaces
│   ├── application/
│   │   ├── usecase/      # Application use cases
│   │   └── dto/          # Application DTOs
│   ├── infrastructure/
│   │   ├── repository/   # Repository implementations
│   │   └── client/       # External service clients
│   └── presentation/
│       ├── controller/   # API controllers
│       ├── dto/         # Request/Response DTOs
│       └── factory/     # Response factories
├── docs/                # Documentation
└── test/               # Tests
```

## Sample Implementation

This project includes a sample implementation of a User management system demonstrating:

- User entity with domain logic
- Email value object with validation
- User repository pattern
- Create and Get user use cases
- RESTful API endpoints

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Key Principles

1. **Separation of Concerns**: Each layer has specific responsibilities
2. **Dependency Inversion**: Higher layers define interfaces, lower layers implement them
3. **Domain Isolation**: Domain layer has no dependencies on other layers
4. **Use Case Driven**: Application layer orchestrates business flows
5. **Infrastructure Abstraction**: External dependencies are abstracted behind interfaces