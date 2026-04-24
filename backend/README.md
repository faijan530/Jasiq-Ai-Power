# JASIQ Backend

## Admin User Setup

### Creating the Default Admin User

To create the bootstrap admin user, run the following command:

```bash
npm run bootstrap:admin
```

This will create an admin user with the following credentials:

- **Email:** `admin@jasiq.com`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the default password after first login!

### Role-Based Access Control

The system supports 4 user roles:

1. **STUDENT** - Can create resumes, use ATS analyzer, and match job descriptions
2. **ADMIN** - Full system access, can manage all users
3. **PLACEMENT_OFFICER** - Can manage students and job postings
4. **RECRUITER** - Can post jobs and find candidates

### Frontend Registration

- Only **STUDENT** role is available for self-registration via the signup page
- **ADMIN**, **PLACEMENT_OFFICER**, and **RECRUITER** roles must be created via:
  - The bootstrap admin script (for the initial admin)
  - Admin panel (for additional users)

### Authentication

All API routes (except `/auth/login` and `/auth/register`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Environment Variables

Required environment variables in `.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
GROQ_API_KEY="your-groq-api-key"
```
