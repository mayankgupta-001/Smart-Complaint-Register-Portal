# Smart Complaint Register

## Overview

Smart Complaint Register is a React + Vite application built for educational institutions to collect, monitor, and manage complaints from students. It uses Appwrite as a backend for user auth and document storage, and provides:

- Student complaint submission + tracking UI
- Home page analytics and recent complaint feed
- Admin dashboard (department-based)
- Super admin overview and management
- CSV export + status updates + delete
- Role-based routing (student / admin / super-admin)

## Tech stack

- React 19
- Vite
- Tailwind CSS
- Appwrite (Auth, Database)
- React Router DOM
- Recharts (charts)
- Lucide React (icons)

## Folder structure

```text
complaint_register/
├── public/                  
├── src/                     # app source files
│   ├── App.jsx              # router + role-based routes
│   ├── HomePage.jsx         # public dashboard & complaints feed
│   ├── LoginPage.jsx        # student login UI
│   ├── index.css            # global styles
│   ├── main.jsx             # app entry point
│   └── components/
│       ├── admin/
│       │   ├── AdminLogin.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── SuperAdminDashboard.jsx
│       ├── students/
│           └── complaintRegister.jsx
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

## Required environment variables

Create a `.env` or `.env.local` file at project root (Vite format):

- `VITE_APPWRITE_ENDPOINT` (e.g. `https://[APPWRITE_HOST]/v1`)
- `VITE_APPWRITE_PROJECT` (project ID)
- `VITE_APPWRITE_DATABASE` (database ID)
- `VITE_APPWRITE_COMPLAINTS_COLLECTION` (collection ID for complaints)
- optional `VITE_N8N_WEBHOOK_URL` (if using n8n for email/notification webhook)

### Example `.env`

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_APPWRITE_DATABASE=complaints-db-id
VITE_APPWRITE_COMPLAINTS_COLLECTION=complaints-collection-id
VITE_N8N_WEBHOOK_URL=https://workflow.n8n.cloud/webhook/your-webhook-id
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL shown in terminal).

## Build

```bash
npm run build
```

## Preview build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Project routes

- `/` → Public HomePage (dashboard, stats, search, trending)
- `/login` → Student login
- `/complaints` → Student complaint hub (requires user session)
- `/admin/login` → Admin login
- `/admin` → Admin dashboard (auto-detect role/department)
- `/admin/:dept` → Optional explicit department route (e.g., `hostel`, `food`, `super`)

## Roles and permissions

- Student: create/view own complaints, track status
- Department admin: view department-specific complaints, status updates, delete, export
- Super admin: view all complaints + full oversight + company-wide analytics

## Appwrite collection schema (recommended)

- `student_id` (string)
- `name` (string)
- `email` (string)
- `category` (string)
- `description` (string)
- `message` (string)
- `status` (enum: `Pending`, `In Progress`, `Resolved`, etc.)
- `created_at` / `$createdAt` (automatic)
- `$id` (document ID)

## Workflows

- Student logs in via Appwrite Email/password, submits complaint with category/desc.
- Admin logs in via Appwrite and is redirected with role detection from `user.prefs` or admin maps.
- Admin updates complaint status or deletes complaint; optional n8n webhook notification firing.

## Notes

- This reference app uses client-side Appwrite calls directly; production should secure writes with server-side functions or rules.
- Ensure Appwrite CORS includes your frontend origin.
- Appwrite database permissions must allow signed-in users to read/write on the complaints collection (or use functions for stricter control).

## Contribution

1. Fork repo
2. Create branch (`feature/xyz`)
3. Commit + push
4. Create PR

## Authors

- Created by Mayank Gupta

