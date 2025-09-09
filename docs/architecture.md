# DDD Architecture Documentation

## Overview

This project demonstrates a clean implementation of Domain-Driven Design (DDD) with a 4-layer architecture pattern. Each layer has specific responsibilities and dependencies flow in one direction.

## Layer Dependencies

```
Presentation Layer
      ↓
Application Layer
      ↓
Domain Layer
      ↑
Infrastructure Layer
```

## Layer Descriptions

### 1. Domain Layer (Core Business Logic)

The heart of the application containing all business rules and logic.

#### Components:
- **Entities** (`/domain/entity/`): Objects with identity that encapsulate business logic
  - Example: `User` entity with methods like `updateProfile()`, `activate()`, `suspend()`
  
- **Value Objects** (`/domain/vo/`): Immutable objects without identity
  - Examples: `Email`, `UserId`, `UserStatus`
  
- **Domain Services** (`/domain/service/`): Business logic that doesn't belong to entities
  - Example: `UserDomainService` with email uniqueness checking and user score calculation
  
- **Repository Interfaces** (`/domain/repository/`): Abstractions for data persistence
  - Example: `UserRepositoryInterface`

#### Key Principles:
- No dependencies on other layers
- Pure business logic
- Rich domain models (not anemic)

### 2. Application Layer (Use Cases)

Orchestrates the flow of data and coordinates domain objects to perform specific tasks.

#### Components:
- **Use Cases** (`/application/usecase/`): Application-specific business rules
  - Examples: `CreateUserUseCase`, `GetUserUseCase`, `UpdateUserUseCase`
  
- **DTOs** (`/application/dto/`): Data structures for use case input/output
  - Examples: `CreateUserDto`, `UserResponseDto`

#### Key Principles:
- Thin layer that orchestrates domain objects
- Transaction boundaries
- No business logic (delegates to domain)

### 3. Infrastructure Layer (External Concerns)

Implements interfaces defined by the domain layer and handles all external concerns.

#### Components:
- **Repository Implementations** (`/infrastructure/repository/`): Concrete data persistence
  - Example: `InMemoryUserRepository` implementing `UserRepositoryInterface`
  
- **External Clients** (`/infrastructure/client/`): Integration with external services
  - Example: `ExternalApiClient` for third-party integrations

#### Key Principles:
- Implements domain interfaces
- Handles all I/O operations
- Can be swapped without affecting business logic

### 4. Presentation Layer (API Interface)

Handles HTTP requests and responses, transforming data between external format and application format.

#### Components:
- **Controllers** (`/presentation/controller/`): HTTP endpoint handlers
  - Example: `UserController` with REST endpoints
  
- **Request/Response DTOs** (`/presentation/dto/`): API contract objects
  - Examples: `CreateUserRequest`, `UserResponse`
  
- **Response Factories** (`/presentation/factory/`): Transform application DTOs to API responses
  - Example: `UserResponseFactory`

#### Key Principles:
- Thin controllers (no business logic)
- Input validation
- Response transformation

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to unit test each layer in isolation
3. **Flexibility**: Can change infrastructure without affecting business logic
4. **Maintainability**: Clear structure makes it easy to locate and modify code
5. **Domain Focus**: Business logic is centralized and protected from external concerns

## Example Flow: Creating a User

1. **Presentation Layer**: 
   - `UserController` receives POST request with `CreateUserRequest`
   - Validates input and creates `CreateUserDto`

2. **Application Layer**:
   - `CreateUserUseCase` receives DTO
   - Calls `UserDomainService` to check email uniqueness
   - Creates `User` entity using domain logic

3. **Domain Layer**:
   - `User.create()` factory method creates new user
   - Business rules are enforced (name validation, initial status)

4. **Infrastructure Layer**:
   - `InMemoryUserRepository` persists the user
   - Returns success to application layer

5. **Application Layer**:
   - Calculates user score using domain service
   - Returns `UserResponseDto`

6. **Presentation Layer**:
   - `UserResponseFactory` transforms DTO to API response
   - Returns HTTP 201 with user data

## Best Practices

1. **Dependency Injection**: Use interfaces for loose coupling
2. **Immutable Value Objects**: Ensure data integrity
3. **Rich Domain Models**: Put business logic in entities, not services
4. **Use Case Per Operation**: Keep use cases focused and single-purpose
5. **Factory Pattern**: Use factories for complex object creation
6. **Repository Pattern**: Abstract data persistence details