# Advanced Task Management Web Application

A fully functional, responsive, and secure Task Management Web Application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This application implements secure JWT authentication, route protection, and comprehensive CRUD operations for personalized task tracking.

## 🚀 Features

### Backend (Node.js & Express)
- **Secure Authentication:** User registration and login utilizing encrypted passwords (bcryptjs).
- **Session Management:** Protected API endpoints backed by custom JSON Web Token (JWT) verification middleware.
- **Database Architecture:** Optimized MongoDB schemas mapping distinct relational task nodes to separate users.

### Frontend (React.js)
- **Responsive Workspace UI:** Clean, structural grid matrix utilizing state hooks for fluid real-time reactivity.
- **Form Validation:** Client-side criteria checks for seamless backend API integration.
- **Advanced State Metrics:** Real-time data filtration and keyword index searching capabilities.

---

## 🛠️ Tech Stack Used

- **Frontend:** React.js, Axios, React Router DOM, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Security:** JWT (JSON Web Tokens), Bcrypt.js

---

## 🏁 Getting Started Locally

### Prerequisites
Ensure you have **Node.js** (LTS version) installed on your system environment.

### 1. Database & Environment Configuration
Create a `.env` file inside the `/backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_custom_secure_jwt_secret

2. Backend Initialization
Bash
cd backend
npm install
npm run dev
3. Frontend Initialization
Bash
cd frontend
npm install
npm run dev
📂 System Project Structure
Plaintext
mern-task-manager/
├── backend/
│   ├── controllers/   # Functional business logic
│   ├── middleware/    # Auth route protectors
│   ├── models/        # Database document structural schemas
│   ├── routes/        # Server REST API endpoints
│   └── server.js      # Core entry point
└── frontend/
    ├── src/
    │   ├── pages/     # Login, Register, Dashboard views
    │   ├── services/  # Shared global API instances
    │   └── App.jsx    # Application Router Engine
