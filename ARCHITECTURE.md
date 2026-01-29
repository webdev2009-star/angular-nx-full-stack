# Architecture Documentation

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Angular Dashboard (Port 4200)                │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │   Auth     │  │   Task      │  │  Audit Log   │  │  │
│  │  │  Features  │  │  Features   │  │   Features   │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │  │
│  │         │               │                  │          │  │
│  │         └───────────────┼──────────────────┘          │  │
│  │                         │                             │  │
│  │                   HTTP Client                          │  │
│  │                (with JWT Interceptor)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS (JWT Token)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              NestJS API (Port 3000)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  JWT Auth Guard                       │  │
│  │              (Global Authentication)                  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Permission Guards                        │  │
│  │           (RBAC Authorization)                        │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────┬───────┴─────────┬──────────┬────────────┐ │
│  │   Auth     │     Tasks       │  Users   │  Audit     │ │
│  │  Module    │    Module       │  Module  │   Log      │ │
│  └────────────┴─────────────────┴──────────┴────────────┘ │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                TypeORM Layer                          │  │
│  └────────────────────┬─────────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              SQLite Database                                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │  users  │  │  tasks   │  │  orgs    │  │ audit_log │   │
│  └─────────┘  └──────────┘  └──────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────┐              ┌──────────┐              ┌──────────┐
│Client│              │   API    │              │ Database │
└──┬───┘              └────┬─────┘              └────┬─────┘
   │                       │                         │
   │ 1. POST /auth/login   │                         │
   │ ─────────────────────>│                         │
   │   {email, password}   │                         │
   │                       │ 2. Query user           │
   │                       │ ───────────────────────>│
   │                       │                         │
   │                       │ 3. User data            │
   │                       │ <───────────────────────│
   │                       │                         │
   │                       │ 4. Verify password      │
   │                       │    (bcrypt compare)     │
   │                       │                         │
   │                       │ 5. Generate JWT         │
   │                       │    (sign with secret)   │
   │                       │                         │
   │ 6. Return token       │                         │
   │ <─────────────────────│                         │
   │   {access_token, user}│                         │
   │                       │                         │
   │ 7. Store token        │                         │
   │    (localStorage)     │                         │
   │                       │                         │
   │ 8. Future requests    │                         │
   │ ─────────────────────>│                         │
   │   Authorization:      │                         │
   │   Bearer <token>      │                         │
   │                       │ 9. Verify & decode JWT  │
   │                       │    (passport strategy)  │
   │                       │                         │
   │ 10. Response          │                         │
   │ <─────────────────────│                         │
```

## Authorization Flow (RBAC)

```
┌──────────────────────────────────────────────────────────┐
│              Incoming Request                             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│           1. JWT Authentication Guard                     │
│   • Extract token from header                            │
│   • Verify token signature                               │
│   • Decode token payload                                 │
│   • Attach user info to request                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│           2. Permissions Guard                           │
│   • Read @RequirePermission decorator                    │
│   • Get user role from request                           │
│   • Check RBAC service for permission                    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│           3. Business Logic Layer                        │
│   • Additional access checks (e.g., ownership)           │
│   • Organization hierarchy validation                    │
│   • Resource-specific permissions                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│           4. Audit Logging                               │
│   • Log action to database                               │
│   • Console output for monitoring                        │
│   • Include user, action, resource, timestamp            │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Response to Client                          │
└──────────────────────────────────────────────────────────┘
```

## Data Flow - Task Creation

```
1. User clicks "New Task" button
        │
        ▼
2. Angular opens CreateTaskModal
        │
        ▼
3. User fills form and submits
        │
        ▼
4. TaskService.createTask() called
        │
        ▼
5. HTTP POST /tasks with JWT token
        │
        ▼
6. NestJS API receives request
        │
        ▼
7. JwtAuthGuard validates token
        │
        ▼
8. PermissionsGuard checks CREATE permission
        │
        ▼
9. TasksController.create() called
        │
        ▼
10. TasksService.create() executes
        │
        ▼
11. Create task entity with user's org
        │
        ▼
12. Save to database via TypeORM
        │
        ▼
13. Create audit log entry
        │
        ▼
14. Return created task to client
        │
        ▼
15. TaskStateService.addTask() updates state
        │
        ▼
16. Angular signals trigger re-render
        │
        ▼
17. New task appears in UI
```

## Shared Libraries Architecture

### @turbovets/data
**Purpose**: Type-safe data contracts between frontend and backend

```typescript
// Shared across both apps
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  ownerId: string;
  organizationId: string;
  // ... more fields
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
```

**Benefits**:
- Single source of truth for data structures
- Compile-time type checking
- Refactoring safety
- Documentation through types

### @turbovets/auth
**Purpose**: Reusable RBAC logic and decorators

```typescript
// Backend decorators
@RequirePermission({ 
  resource: ResourceType.TASK, 
  action: PermissionAction.CREATE 
})

// Shared RBAC service
rbacService.hasPermission(
  UserRole.ADMIN, 
  ResourceType.TASK, 
  PermissionAction.CREATE
) // returns true/false
```

**Benefits**:
- Consistent permission logic
- Easy to test in isolation
- Reusable across microservices
- Clear permission definitions

## State Management (Frontend)

### Angular Signals Architecture

```typescript
// TaskStateService using signals
class TaskStateService {
  // Private writable signals
  private tasks = signal<ITask[]>([]);
  private filters = signal<TaskFilterDto>({});
  
  // Public readonly signals
  allTasks = this.tasks.asReadonly();
  
  // Computed signals (automatic reactivity)
  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filters();
    return tasks.filter(/* filter logic */);
  });
  
  taskStats = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      done: tasks.filter(t => t.status === 'DONE').length,
      // ... more stats
    };
  });
}
```

**Benefits**:
- Fine-grained reactivity
- Automatic dependency tracking
- No need for observables in simple cases
- Better performance than zone.js
- Type-safe

## Security Layers

### Layer 1: Network Security
- CORS configuration
- HTTPS (in production)
- Rate limiting (future)

### Layer 2: Authentication
- JWT token validation
- Token expiration (24h)
- Secure token storage
- Password hashing (bcrypt)

### Layer 3: Authorization
- Role-based permissions
- Resource ownership checks
- Organization scoping
- Permission guards

### Layer 4: Input Validation
- DTO validation (class-validator)
- SQL injection prevention (TypeORM)
- XSS prevention (Angular sanitization)

### Layer 5: Audit & Monitoring
- Action logging
- User tracking
- IP address logging
- Timestamp recording

## Database Schema Design Decisions

### 1. User-Organization Relationship
**Decision**: Many-to-one relationship
**Rationale**: 
- Users belong to one primary organization
- Simplifies permission checks
- Supports 2-level hierarchy via parentOrganizationId

### 2. Task Ownership
**Decision**: Each task has a single owner
**Rationale**:
- Clear accountability
- Simple permission model
- Easy to track who created what

### 3. Organization Hierarchy
**Decision**: Self-referencing relationship (parentId)
**Rationale**:
- Flexible for future expansion
- Currently supports 2 levels
- Can extend to N levels if needed

### 4. Audit Log Design
**Decision**: Separate table with detailed tracking
**Rationale**:
- Don't pollute entity tables
- Easy to query audit trails
- Can archive old logs
- Supports compliance requirements

## Scalability Considerations

### Current Scale (Monolith)
- Single NestJS server
- SQLite database
- Suitable for: <1000 users, <100k tasks

### Medium Scale (10k users)
- Switch to PostgreSQL
- Add Redis caching
- Load balancer with multiple API instances
- CDN for frontend assets

### Large Scale (100k+ users)
- Microservices architecture
- Separate auth service
- Message queue (RabbitMQ/Kafka)
- Distributed caching
- Database sharding by organization

## Error Handling Strategy

### Backend
```typescript
// Custom exceptions
throw new ForbiddenException('Insufficient permissions');
throw new NotFoundException('Task not found');

// Global exception filter
{
  statusCode: 403,
  message: 'Insufficient permissions',
  timestamp: '2024-01-01T00:00:00.000Z',
  path: '/tasks/123'
}
```

### Frontend
```typescript
// HTTP interceptor handles errors
this.taskService.createTask(dto).subscribe({
  next: (task) => { /* success */ },
  error: (err) => {
    // Display user-friendly message
    this.error = err.error?.message || 'Operation failed';
  }
});
```

## Testing Strategy

### Backend (Jest)
- **Unit Tests**: Services, guards, strategies
- **Integration Tests**: Controllers with mocked services
- **E2E Tests**: Full request/response cycle (future)

### Frontend (Jest + Angular Testing)
- **Unit Tests**: Services, components
- **Integration Tests**: Component with real services
- **E2E Tests**: Cypress/Playwright (future)

### Coverage Goals
- Critical paths: >90%
- Business logic: >80%
- UI components: >70%

## Performance Optimizations

### Backend
- Database indexing on frequently queried fields
- Eager loading with TypeORM relations
- Response caching (future)
- Query optimization

### Frontend
- Lazy loading routes
- OnPush change detection
- Virtual scrolling for large lists (future)
- Service worker for offline support (future)
- Image optimization

## Monitoring & Observability (Future)

### Logging
- Structured logging (Winston/Pino)
- Log aggregation (ELK stack)
- Error tracking (Sentry)

### Metrics
- Request latency
- Error rates
- Active users
- Database query performance

### Tracing
- Distributed tracing (Jaeger)
- Request flow visualization
- Bottleneck identification

---

This architecture balances simplicity for the current scale while providing clear paths for growth and enhancement.
