# 🏫 AI Timetable & Exam Scheduler

A premium full-stack application designed to automate complex college schedules. Features role-based dashboards, AI-powered conflict-free generating, and a modern, glassmorphic UI.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Premium Custom Design)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Engine**: Python (Genetic/Greedy Optimization)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance running)
- **Python 3.x** (Required for AI generation)

### 2. Backend Setup
```bash
cd ai-timetable-backend
npm install
```
- Create a `.env` file in the `ai-timetable-backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_timetable
```

### 3. Database Initialization (CRITICAL)
Choose one of the two ways to get test data:
- **Fresh Seed (Recommended)**: Runs a clean script to create Department, Programs, Courses, and all Users.
  ```bash
  node seedData.js
  ```
- **Import Backup**: Restores a full snapshot of all data.
  ```bash
  node importDB.js
  ```

### 4. Running the Project
- **Backend**: `npm start` or `node server.js` (Port 5000)
- **Frontend**:
  ```bash
  cd ai-timetable-frontend/ai-timetable-frontend
  npm install
  npm run dev
  ```
  Visit: `http://localhost:5173`

---

## 🔑 Demo Credentials
All passwords are: **`password123`** (unless specified)

| Role | Name | Email |
| :--- | :--- | :--- |
| **Admin** | Admin User | `admin@gmail.com` (pass: `admin123`) |
| **HOD** | Dr. Smith | `hod@gmail.com` |
| **Teacher** | Prof. Alan | `alan@gmail.com` |
| **Teacher** | Prof. Grace | `grace@gmail.com` |
| **Student** | John Doe (Sem 1) | `student1@gmail.com` |
| **Student** | Jane Smith (Sem 3) | `student3@gmail.com` |

---

## ✨ Core Features

### 📅 Smart Class Timetables
- **AI-Powered**: Generates weekly schedules based on credit hours and room availability.
- **Teacher Availability**: Ensures no faculty is overbooked or doubled-up.
- **Role-Based Views**: Students see only their class; Teachers see their teaching load; HODs see everything.

### 📝 Exam Scheduling
- **Conflict-Free**: Automatically avoids scheduling two exams for the same semester in the same slot.
- **Sunday Exclusion**: Intelligent date selection that keeps Sundays free.
- **Premium Grid View**: A beautiful, card-based interface for managing and viewing exams grouped by date.

### 🏢 Department Management
- Auto-selection of departments and programs for HODs.
- Detailed "Add User" and mapping tools for Administrators.

---

## 📦 Database Portability
The project includes specialized scripts to make moving the database between machines effortless:
- `exportDB.js`: Saves a complete JSON snapshot of all 12+ collections to `/database_backup`.
- `importDB.js`: Instantly restores the entire system state from the backup folder.