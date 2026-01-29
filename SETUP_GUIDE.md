# Quick Setup Guide

## Step-by-Step Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup (Optional)

The application works with default settings, but you can customize by creating a `.env` file:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production-min-32-chars
```

### 3. Start the Backend
```bash
npm run start:api
```

Wait for the message: `🚀 API is running on: http://localhost:3000`

### 4. Start the Frontend (New Terminal)
```bash
npm run start:dashboard
```

Wait for: `Angular Live Development Server is listening on localhost:4200`

### 5. Open Your Browser

Navigate to: `http://localhost:4200`

### 6. Create Your Account

1. Click "Sign up" or go to `/auth/register`
2. Fill in:
   - Email: `admin@example.com`
   - Username: `admin`
   - Password: `password123` (minimum 6 characters)
   - Organization Name: `My Company` (optional)
3. Click "Create Account"

You'll be automatically logged in as an OWNER with full permissions.

### 7. Start Using the App

- **Create Tasks**: Click the "New Task" button
- **Drag & Drop**: Drag tasks between columns (To Do, In Progress, Done)
- **Filter Tasks**: Use the filter bar to search and filter
- **View Stats**: See your completion rate at the top
- **Dark Mode**: Toggle with the moon/sun icon
- **Audit Logs**: Click "Audit Log" to see all actions (Owner/Admin only)

## Testing Different Roles

To test the system with different roles, you'll need to:

1. Register multiple users
2. Manually update the database to assign different roles
3. Or modify the registration logic temporarily

### Using SQLite Database Viewer

Install a SQLite viewer like:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- Or use VS Code extension: "SQLite"

Open `database.sqlite` to view/edit data.

## Troubleshooting

### Port Already in Use

If port 3000 or 4200 is already in use:

**Backend:**
```bash
PORT=3001 npm run start:api
```

Then update `apps/dashboard/src/app/core/services/auth.service.ts` and `task.service.ts` to use `http://localhost:3001`

**Frontend:**
```bash
npm run start:dashboard -- --port 4201
```

### Database Issues

Delete the database and restart:
```bash
rm database.sqlite
npm run start:api
```

### Dependencies Not Installing

Try:
```bash
npm clean-install
# or
rm -rf node_modules package-lock.json
npm install
```

## Running Tests

```bash
# All tests
npm test

# Backend only
npm run test:api

# Frontend only
npm run test:dashboard
```

## Building for Production

```bash
# Build backend
npm run build:api

# Build frontend  
npm run build:dashboard

# Output:
# - Backend: dist/apps/api
# - Frontend: dist/apps/dashboard
```

## Default Credentials

After registration, you can use:
- Email: `admin@example.com`
- Password: `password123`

Or create any account you like!

## API Documentation

Once the backend is running, you can test the API:

### Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get Tasks
```bash
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

See the main README.md for complete API documentation.

## Need Help?

Check the main README.md for:
- Complete architecture documentation
- Detailed API reference
- RBAC explanation
- Future considerations
