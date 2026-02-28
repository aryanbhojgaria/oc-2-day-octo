# OctoCampus Backend – Setup Guide

## Prerequisites
- Node.js 18+
- A PostgreSQL database (local or cloud)

## Step 1 – Configure Environment

Copy `.env.example` to `.env` and fill in your database URL:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/octocampus"
JWT_SECRET="octocampus-super-secret-jwt-key-2026"
PORT=4000
```

**Free cloud options**: [Neon](https://neon.tech) · [Supabase](https://supabase.com) · [Railway](https://railway.app)

---

## Step 2 – Push Schema & Seed

```bash
# Push schema to your database
npx prisma db push

# Seed with demo data
npm run seed
```

---

## Step 3 – Start the Server

```bash
npm run dev
```

Server starts at **http://localhost:4000**

---

## Step 4 – Start the Frontend

In a separate terminal, from the `her/` root:

```bash
npm run dev
```

Frontend at **http://localhost:3000**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/students` | List all students (admin/teacher) |
| GET | `/api/students/me` | Own profile (student) |
| GET | `/api/teachers` | List all teachers |
| GET | `/api/announcements` | All announcements |
| POST | `/api/announcements` | Create announcement (admin) |
| GET | `/api/events` | All events |
| POST | `/api/events` | Create event (admin/club) |
| GET | `/api/requests` | All requests (admin) |
| PATCH | `/api/requests/:id` | Approve/reject (admin) |
| GET | `/api/fees` | Student's own fees |
| PATCH | `/api/fees/:id/pay` | Mark fee as paid |
| GET | `/api/marks` | Marks (role-aware) |
| GET | `/api/attendance` | Attendance (role-aware) |
| POST | `/api/attendance` | Mark attendance (teacher) |
| GET | `/api/clubs` | All clubs |
| GET | `/api/timetable` | Timetable (role-aware) |
| GET | `/api/notifications` | User's notifications |

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@oc-2-day.edu | admin@2026 |
| Teacher | teacher@oc-2-day.edu | teach@2026 |
| Student | student@oc-2-day.edu | stud@2026 |
| Parent | parent@oc-2-day.edu | parent@2026 |
| Club | club@oc-2-day.edu | club@2026 |
