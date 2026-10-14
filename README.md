# Campus Fix - Frontend

React UI for **Campus Fix: A Web-Based Campus Complaint Tracking System**.

**Stack:** React 18, Vite, React Router, plain CSS

## Setup

```bash
npm install
cp .env.example .env     # set VITE_API_URL to your backend URL
npm run dev              # http://localhost:5173
```

Run the backend first (see the `campusfix-backend` repo).

## Pages

| Route | Who | What |
|---|---|---|
| /login, /register | everyone | Auth (register has optional admin code) |
| /my | student | Track own complaints and their status |
| /new | student | Report an issue with category, location, photo |
| /admin | admin | Stats, filters, change status, assign staff, add notes |

## Build / deploy
`npm run build` creates `dist/`. Deploy on Vercel or Netlify and set `VITE_API_URL` to the deployed backend URL.

## Folder structure

```
src/
  main.jsx, App.jsx     entry, routes, navbar
  AuthContext.jsx       login/register/logout state
  api.js                fetch wrapper with JWT
  pages/                Login, Register, MyComplaints, NewComplaint, AdminDashboard
  components/           StatusBadge
  styles.css
```
