# Secure Task Management System

A full-stack task management application with role-based access control (RBAC), built with NestJS, Angular, and NX monorepo.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Data Model](#data-model)
- [Access Control Implementation](#access-control-implementation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Future Considerations](#future-considerations)

## 🎯 Overview

This project is a secure task management system that demonstrates:
- **JWT-based authentication** with real token verification
- **Role-Based Access Control (RBAC)** with three roles: Owner, Admin, and Viewer
- **2-level organizational hierarchy** for scoped access control
- **Comprehensive audit logging** for tracking all actions
- **Modern, responsive UI** with drag-and-drop task management
- **Full NX monorepo** structure with shared libraries

## 🏗️ Architecture

### NX Monorepo Layout

```
TurboVets/
├── apps/
│   ├── api/                    # NestJS backend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── auth/      # Authentication module
│   │   │   │   ├── users/     # Users module
│   │   │   │   ├── organizations/  # Organizations module
│   │   │   │   ├── tasks/     # Tasks module (main resource)
│   │   │   │   ├── audit-log/ # Audit logging module
│   │   │   │   └── entities/  # TypeORM entities
│   │   │   └── main.ts
│   │   └── project.json
│   │
│   └── dashboard/              # Angular frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/      # Core services and guards
│       │   │   ├── features/  # Feature modules (auth, dashboard)
│       │   │   └── app.component.ts
│       │   └── main.ts
│       └── project.json
│
├── libs/
│   ├── data/                   # Shared TypeScript interfaces & DTOs
│   │   └── src/
│   │       └── lib/
│   │           ├── interfaces.ts
│   │           ├── dto.ts
│   │           └── enums.ts
│   │
│   └── auth/                   # Reusable RBAC logic and decorators
│       └── src/
│           └── lib/
│               ├── decorators.ts
│               ├── guards.ts
│               ├── strategies.ts
│               └── rbac.service.ts
│
├── package.json
├── nx.json
└── tsconfig.base.json
```

### Rationale

The NX monorepo structure provides:
1. **Code Sharing**: Common interfaces and RBAC logic are shared between frontend and backend
2. **Type Safety**: End-to-end type safety from API to UI
3. **Scalability**: Easy to add new apps and libraries
4. **Build Optimization**: NX's computation caching speeds up builds and tests
5. **Developer Experience**: Consistent tooling and commands across all projects

## ✨ Features

### Backend Features

- ✅ **JWT Authentication**: Real authentication with token-based security
- ✅ **Role-Based Access Control**: Owner, Admin, and Viewer roles with different permissions
- ✅ **Organization Hierarchy**: 2-level organization structure for access scoping
- ✅ **Task Management**: Full CRUD operations with permission checks
- ✅ **Audit Logging**: Comprehensive logging of all actions to console and database
- ✅ **TypeORM Integration**: SQLite database with automatic migrations
- ✅ **Permission Guards**: Decorator-based permission checking
- ✅ **Error Handling**: Proper HTTP status codes and error messages

### Frontend Features

- ✅ **Responsive Design**: Mobile-first design that works on all screen sizes
- ✅ **Drag & Drop**: Intuitive task board with drag-and-drop between columns
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Real-time Updates**: Tasks update immediately after actions
- ✅ **Authentication UI**: Clean login and registration forms
- ✅ **Task Filtering**: Filter by status, category, and search text
- ✅ **Task Statistics**: Visual stats showing completion rates
- ✅ **Audit Log Viewer**: View system audit logs (Owner/Admin only)
- ✅ **State Management**: Angular signals for reactive state management
- ✅ **Modern UI**: TailwindCSS for beautiful, consistent styling

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **SQLite** - Lightweight database (easily swappable with PostgreSQL)
- **Passport JWT** - JWT authentication strategy
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

### Frontend
- **Angular 17** - Modern Angular with standalone components
- **TailwindCSS** - Utility-first CSS framework
- **Angular CDK** - Drag and drop functionality
- **RxJS** - Reactive programming
- **Angular Signals** - State management
- **Angular HTTP Client** - API communication

### Monorepo & Tooling
- **NX** - Smart monorepo build system
- **TypeScript** - Type-safe development
- **Jest** - Testing framework
- **ESLint** - Code linting

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment (Optional)**

The application works with default settings. To customize, create a `.env` file:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

> **Important**: Change the JWT_SECRET in production to a secure, randomly generated string of at least 32 characters.

3. **Start the backend API**
```bash
npm run start:api
```

Wait for: `🚀 API is running on: http://localhost:3000`

4. **Start the frontend dashboard** (in a new terminal)
```bash
npm run start:dashboard
```

Wait for: `Angular Live Development Server is listening on localhost:4200`

5. **Open your browser**

Navigate to: `http://localhost:4200`

### First Time Setup

1. **Register a new account** - Click "Sign up" or go to `/auth/register`
   - Email: `admin@example.com`
   - Username: `admin`
   - Password: `password123` (minimum 6 characters)
   - Organization Name: `My Company` (optional)
   - The first user is automatically assigned the **OWNER** role

2. **Start using the app!**
   - **Create Tasks**: Click the "New Task" button
   - **Drag & Drop**: Drag tasks between columns (To Do, In Progress, Done)
   - **Filter Tasks**: Use the filter bar to search and filter
   - **View Stats**: See your completion rate at the top
   - **Dark Mode**: Toggle with the moon/sun icon
   - **Audit Logs**: Click "Audit Log" to see all actions (Owner/Admin only)

### Troubleshooting

**Port Already in Use:**
```bash
# Backend (use port 3001 instead)
PORT=3001 npm run start:api

# Frontend (use port 4201 instead)
npm run start:dashboard -- --port 4201
```

**Database Issues:**
```bash
rm database.sqlite
npm run start:api
```

**Dependencies Not Installing:**
```bash
npm clean-install
# or
rm -rf node_modules package-lock.json
npm install
```

### Running Tests

```bash
# All tests
npm test

# Backend only
npm run test:api

# Frontend only
npm run test:dashboard

# With coverage
npm test -- --coverage
```

### Building for Production

```bash
# Build backend
npm run build:api

# Build frontend
npm run build:dashboard

# Build all
nx run-many --target=build --all

# Output:
# - Backend: dist/apps/api
# - Frontend: dist/apps/dashboard
```

### Testing Different Roles

To test with different user roles:

1. Register multiple users
2. Use a SQLite viewer to modify roles:
   - [DB Browser for SQLite](https://sqlitebrowser.org/)
   - Or VS Code extension: "SQLite"
3. Open `database.sqlite` and update the `role` field in the `users` table

## 📊 Data Model

### Entity Relationship Diagram

```
┌─────────────────┐
│  Organization   │
├─────────────────┤
│ id              │◄────┐
│ name            │     │
│ parentId        │     │
│ createdAt       │     │
│ updatedAt       │     │
└─────────────────┘     │
         △              │
         │              │
         │              │
┌─────────────────┐     │
│      User       │     │
├─────────────────┤     │
│ id              │     │
│ email           │     │
│ username        │     │
│ password        │     │
│ role            │     │
│ organizationId  │─────┘
│ parentOrgId     │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
         △
         │
         │
┌─────────────────┐     ┌─────────────────┐
│      Task       │     │   AuditLog      │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ title           │     │ userId          │───┐
│ description     │     │ action          │   │
│ status          │     │ resource        │   │
│ category        │     │ resourceId      │   │
│ ownerId         │─────┤ details         │   │
│ organizationId  │     │ ipAddress       │   │
│ order           │     │ timestamp       │   │
│ createdAt       │     └─────────────────┘   │
│ updatedAt       │                           │
└─────────────────┘                           │
                                              │
                      ┌───────────────────────┘
                      └─────► User
```

### Schema Description

#### User
- **Purpose**: Represents users in the system
- **Key Fields**:
  - `role`: Owner, Admin, or Viewer
  - `organizationId`: Links user to their organization
  - `parentOrganizationId`: Optional, for 2-level hierarchy
- **Relationships**: Belongs to an Organization, owns many Tasks

#### Organization
- **Purpose**: Groups users and tasks for access control
- **Key Fields**:
  - `parentId`: Links to parent organization (2-level hierarchy)
- **Relationships**: Has many Users and Tasks, optional parent Organization

#### Task
- **Purpose**: Main resource that users manage
- **Key Fields**:
  - `status`: TODO, IN_PROGRESS, or DONE
  - `category`: WORK, PERSONAL, URGENT, or OTHER
  - `order`: For drag-and-drop ordering
- **Relationships**: Belongs to a User (owner) and Organization

#### AuditLog
- **Purpose**: Tracks all system actions for security and compliance
- **Key Fields**:
  - `action`: CREATE, READ, UPDATE, DELETE, etc.
  - `resource`: Type of resource (TASK, USER, etc.)
  - `details`: Human-readable description
  - `ipAddress`: Request origin
- **Relationships**: Belongs to a User

## 🔒 Access Control Implementation

### Role Hierarchy

```
Owner (Full Access)
  │
  ├─► Can manage all tasks in organization
  ├─► Can view audit logs
  ├─► Can manage users
  └─► Access to all child organizations

Admin (Moderate Access)
  │
  ├─► Can create, read, update, delete tasks
  ├─► Can view audit logs
  └─► Limited to own organization

Viewer (Read-Only)
  │
  ├─► Can only view their own tasks
  └─► Cannot access audit logs
```

### Permission Matrix

| Action | Owner | Admin | Viewer |
|--------|-------|-------|--------|
| Create Task | ✅ | ✅ | ❌ |
| Read Own Tasks | ✅ | ✅ | ✅ |
| Read All Tasks | ✅ | ✅ | ❌ |
| Update Tasks | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

### Implementation Details

#### 1. JWT Integration

**Token Generation** (`auth.service.ts`):
```typescript
const payload: JwtPayload = {
  sub: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
  organizationId: user.organizationId,
  parentOrganizationId: user.parentOrganizationId,
};
return this.jwtService.sign(payload);
```

**Token Verification** (`jwt-auth.guard.ts`):
- Global guard applied to all routes
- Checks for valid JWT token in Authorization header
- Decodes token and attaches user info to request
- Public routes marked with `@Public()` decorator

#### 2. RBAC Decorators

**Role Checking**:
```typescript
@Roles(UserRole.OWNER, UserRole.ADMIN)
@Get('/admin-only')
adminRoute() { ... }
```

**Permission Checking**:
```typescript
@RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.CREATE })
@Post()
createTask() { ... }
```

#### 3. Organization Hierarchy

Tasks are scoped by organization:
- Users can only access tasks within their organization
- Owners can access child organizations
- Viewers are restricted to their own tasks only

**Implementation** (`tasks.service.ts`):
```typescript
const orgIds = await this.orgsService.getOrgHierarchy(userOrgId);
const tasks = await this.tasksRepository.find({
  where: { organizationId: In(orgIds) }
});
```

#### 4. Audit Logging

Every action is logged:
```typescript
await this.logAction(
  userId,
  'CREATE',
  ResourceType.TASK,
  task.id,
  `Created task: ${task.title}`,
  req.ip
);
```

Logs are:
- Stored in database
- Output to console
- Accessible only to Owner/Admin roles

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "organizationName": "My Company" // optional
}

Response: 201 Created
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "OWNER",
    "organizationId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Get All Tasks
```http
GET /tasks
GET /tasks?status=TODO
GET /tasks?category=WORK
GET /tasks?search=meeting

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the task management system",
    "status": "IN_PROGRESS",
    "category": "WORK",
    "ownerId": "uuid",
    "organizationId": "uuid",
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "owner": {
      "id": "uuid",
      "username": "johndoe",
      "email": "user@example.com"
    }
  }
]
```

#### Create Task
```http
POST /tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "New Task",
  "description": "Task description",
  "status": "TODO",
  "category": "WORK"
}

Response: 201 Created
{
  "id": "uuid",
  "title": "New Task",
  ...
}
```

#### Update Task
```http
PUT /tasks/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "status": "DONE"
}

Response: 200 OK
{
  "id": "uuid",
  "title": "Updated Title",
  "status": "DONE",
  ...
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

### Audit Log Endpoints

#### Get Audit Logs (Owner/Admin only)
```http
GET /audit-log
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "userId": "uuid",
    "action": "CREATE",
    "resource": "TASK",
    "resourceId": "uuid",
    "details": "Created task: Complete project",
    "ipAddress": "127.0.0.1",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "username": "johndoe"
    }
  }
]
```

### Error Responses

```json
// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "Task not found"
}

// 400 Bad Request
{
  "statusCode": 400,
  "message": ["title must be longer than or equal to 3 characters"],
  "error": "Bad Request"
}
```

## 🧪 Testing

### Test Structure

```
apps/api/src/app/
├── auth/
│   └── auth.service.spec.ts
├── tasks/
│   └── tasks.service.spec.ts
└── ...

apps/dashboard/src/app/core/services/
├── auth.service.spec.ts
└── task.service.spec.ts
```

### Backend Tests

Tests cover:
- ✅ Authentication service (login, register, token generation)
- ✅ Task service (CRUD operations, permission checks)
- ✅ RBAC logic (role hierarchy, permissions)
- ✅ Organization hierarchy access

Run with:
```bash
npm run test:api
```

### Frontend Tests

Tests cover:
- ✅ Auth service (login, logout, token management)
- ✅ Task service (HTTP calls, filtering)
- ✅ Guards (authentication checks)
- ✅ Component rendering and interactions

Run with:
```bash
npm run test:dashboard
```

### Test Coverage

Aim for >70% coverage on critical paths:
- Authentication flows
- Permission checking
- Task CRUD operations

## 🚀 Future Considerations

### Advanced Role Delegation
- Custom roles with granular permissions
- Role templates and inheritance
- Dynamic permission assignment
- Team-based access control

### Production-Ready Security
- **JWT Refresh Tokens**: Implement refresh token rotation
- **CSRF Protection**: Add CSRF tokens for state-changing operations
- **Rate Limiting**: Prevent brute force attacks
- **Input Sanitization**: Enhanced XSS protection
- **HTTPS Only**: Force secure connections
- **Security Headers**: Helmet.js for security headers
- **Password Policies**: Enforce strong passwords

### RBAC Caching
- Redis cache for permission lookups
- In-memory permission cache with TTL
- Invalidation strategies for role changes

### Performance Optimizations
- Database indexing on frequently queried fields
- Query optimization with proper joins
- Pagination for large datasets
- GraphQL for flexible data fetching
- WebSocket for real-time updates

### Scalability
- PostgreSQL for production database
- Horizontal scaling with load balancers
- Microservices architecture for large teams
- Message queue for async operations
- CDN for frontend assets

### Enhanced Features
- Task dependencies and subtasks
- File attachments
- Comments and mentions
- Email notifications
- Calendar integration
- Advanced analytics dashboard
- Export to CSV/PDF
- Mobile app (Ionic/React Native)

### DevOps
- Docker containerization
- Kubernetes orchestration
- CI/CD pipelines
- Automated testing
- Environment configurations
- Monitoring and logging (ELK stack)
- Health checks and alerts

## 📝 License

MIT

## 👤 Author

Created for TurboVets coding assessment.

---

**Note**: This is a demonstration project. For production use, please implement the security enhancements mentioned in the "Future Considerations" section.
