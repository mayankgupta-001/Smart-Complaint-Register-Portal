# Complaint Portal

A modern web application for managing student complaints in a college environment. Built with React, Vite, and Appwrite backend.

## Features

### For Students
- **Complaint Registration**: Submit complaints categorized by department (Hostel, Food, etc.)
- **Complaint Tracking**: View status and history of submitted complaints
- **Real-time Updates**: Get notifications on complaint status changes
- **Dashboard**: Overview of complaint statistics and trends

### For Administrators
- **Role-based Access**: Different admin levels (College Admin, Super Admin)
- **Complaint Management**: View, update, and resolve complaints
- **Department-specific Dashboards**: Admins can manage complaints for their department
- **Analytics**: Charts and statistics for complaint resolution metrics
- **Search & Filter**: Advanced filtering by status, category, and date

### For Super Administrators
- **System-wide Oversight**: Access to all complaints across departments
- **User Management**: Manage admin roles and permissions
- **Global Analytics**: Comprehensive statistics and reporting

## Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Backend**: Appwrite (Authentication, Database, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Automation**: n8n webhooks for notifications

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT=your_appwrite_project_id
VITE_APPWRITE_DATABASE=your_database_id
VITE_APPWRITE_COMPLAINTS_COLLECTION=your_complaints_collection_id
VITE_APPWRITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
VITE_APPWRITE_ADMIN_MAP=admin1@example.com:college-admin,admin2@example.com:super-admin
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Appwrite project and configure environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   └── SuperAdminDashboard.jsx
│   └── students/
│       └── complaintRegister.jsx
├── App.jsx
├── HomePage.jsx
├── LoginPage.jsx
└── main.jsx
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

