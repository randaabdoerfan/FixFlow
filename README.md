# FixFlow - Ticketing & Support System

A full-stack ticket management system with role-based dashboards, real-time chat, and team management.

## Tech Stack

**Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Socket.IO Client, Axios  
**Backend:** Node.js, Express 5, MongoDB (Mongoose 9), Socket.IO, JWT, Nodemailer, Cloudinary, Multer

## Roles

| Role | Access |
|------|--------|
| **Admin** | Full control — manage users, teams, all tickets, bypass status transitions |
| **Manager** | Manage team tickets, chat with agents, view team stats, filter by member |
| **Agent** | Handle assigned tickets, chat with manager, view own documents |
| **Client** | Create tickets, chat when assigned, upload files |

## Pages

### Public
- `/` — Landing page
- `/fixflow` — Service info pages
- `/auth/login` — Login
- `/auth/signup` — Registration
- `/auth/forgot-password` — Password reset request
- `/auth/resetpassword/[token]` — Set new password

### Dashboard (authenticated)
- `/dashboard` — Role-aware dashboard with ticket counts and documents
- `/tickets` — My tickets with real-time chat, manager chat, file uploads
- `/admin` — Admin panel (users CRUD, ticket management, teams, activity logs)
- `/manager` — Team management, member stats, agent chat
- `/clientForm` — Create a new ticket
- `/clientTicket` — View and chat on your tickets
- `/teams` — View teams and members
- `/documents` — View uploaded documents

## Setup

### Backend
```bash
cd Backend
npm install
# configure .env with MONGO_URI, JWT_SECRET, EMAIL_*, CLOUDINARY_*
nodemon index.js
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Key Features

- Real-time messaging (Socket.IO) per ticket and direct user-to-user
- Role-based UI rendering and API authorization
- Activity log for all ticket status changes
- Email notifications on ticket creation and status updates
- File uploads via Cloudinary
- Dark mode with theme toggle (persisted to localStorage)
- Auto-assign tickets to admin when "Other" team selected
- Mongoose deprecation-free (`returnDocument: 'after'`)
