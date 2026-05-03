# 🚀 SmartHire AI Job Portal

A full-stack **AI-powered Job Portal** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

- 🤖 **AI Skill Matching** — Get a match % for every job based on your skills
- 📊 **Skill Gap Analysis** — See exactly which skills you're missing
- 💬 **Direct Chat** — Message recruiters after applying
- 📄 **Resume Upload** — Upload PDF resume, recruiters can view it
- ⭐ **Save Jobs** — Bookmark jobs you like
- 📋 **Application Tracking** — Track status: Pending → Shortlisted → Hired
- 🔐 **JWT Authentication** — Secure login with role-based access
- 👤 **Job Seeker Dashboard** — Applications, saved jobs, recommendations
- 🏢 **Recruiter Dashboard** — Post jobs, manage applicants, update status

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed

### Steps

**Terminal 1 — Start MongoDB:**
```bash
mongod
```

**Terminal 2 — Start Backend:**
```bash
cd backend
npm install
node server.js
```

**Terminal 3 — Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📁 Project Structure

```
smart-job-portal/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, Role, Upload
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── utils/          # Skill matching algorithm
│   └── server.js
└── frontend/
    └── src/
        ├── components/ # Reusable components
        ├── context/    # Auth context
        ├── pages/      # All pages
        └── api/        # Axios instance
```

## 👩‍💻 Developer

**Shruthi S Nayak**  
B.E Computer Science & Engineering  
Srinivas Institute of Technology, Mangalore

---
⭐ Star this repo if you found it helpful!
