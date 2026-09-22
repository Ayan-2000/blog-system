# Blogify — MERN Stack Blogging Platform

**Blogify** is a clean, full-stack blogging web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js). It allows users to write, publish, and explore articles with a responsive interface, complete with social Google authentication and role-based admin controls.

---

## 🚀 Key Features

- **Authentication & Authorization**
  - Traditional Sign Up / Sign In with email & password (encrypted with `bcryptjs`).
  - One-click **Google Sign-In / Sign-Up** powered by Firebase.
  - Secure session management using JSON Web Tokens (JWT) and HTTP-only cookies.

- **Blog Post Management**
  - Create, edit, and read formatted blog posts.
  - SEO-friendly URL slugs for individual posts.
  - Soft-delete and restore functionality for post recovery.

- **Interactive Comments**
  - Reader comments on blog posts with live updates and deletion controls for authors/admins.

- **Role-Based Admin Panel**
  - **User** vs. **Admin** roles.
  - Dedicated admin dashboard with overview statistics and user management (change roles or remove users).

- **Modern & Responsive UI**
  - Built with React 19, Vite, and Tailwind CSS.
  - Clean card layouts, interactive modals, and mobile-friendly design.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios, Lucide / React Icons |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Token (JWT), Cookie Parser |
| **Database** | MongoDB Atlas |
| **Auth / Cloud** | Firebase Client SDK (Google Auth) |

---

## 📂 Project Structure

```text
mern-blog-system/
├── backend/
│   ├── config/              # Database connection & Firebase config
│   ├── controllers/         # Request logic (auth, post, comment, user)
│   ├── middlewares/         # Authentication check (isAuth)
│   ├── models/              # Mongoose schemas (User, Post, Comment)
│   ├── routes/              # Express API route endpoints
│   ├── utils/               # JWT token generator
│   ├── .env                 # Server port, MongoDB URI, JWT secret
│   └── index.js             # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation, Footer, cards, modals
│   │   ├── context/         # AuthContext (login state & persistence)
│   │   ├── pages/           # Home, PostDetail, CreateEditPost, Admin, SignIn, SignUp
│   │   ├── App.jsx          # Routing & layout
│   │   └── main.jsx         # React root
│   ├── utils/               # Firebase client configuration
│   └── .env                 # Firebase web API key
│
└── README.md
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) database connection URI
- A [Firebase Project](https://console.firebase.google.com/) with Google Authentication enabled

---

### 2. Setup Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with:
   ```env
   PORT=6004
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:6004`.*

---

### 3. Setup Frontend

1. In a new terminal, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/` with your Firebase API key:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_web_api_key
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🔒 Security Best Practices
- Never commit `.env` or `serviceAccountKey.json` files to Git. Both are listed in `.gitignore`.
- Authentication tokens are transmitted in HTTP-only cookies to protect against XSS token theft.
