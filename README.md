# 🚀 QuikAI — AI-Powered SaaS Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-brightgreen)
![Database](https://img.shields.io/badge/database-MongoDB-green)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Clipdrop-purple)

---

## 📌 Project Description

**QuikAI** is a full-stack AI SaaS platform designed to streamline content creation, image processing, and resume analysis through powerful AI integrations.

It delivers a seamless user experience with a **scalable architecture**, **secure authentication**, and **high-performance APIs**, making it production-ready for real-world deployment.

---

## ✨ Features

### 🧠 AI Content Generation
- Generate SEO-friendly blog titles
- Create full-length AI articles
- Markdown-supported rendering

### 🖼️ Image Generation & Editing
- AI-based image generation
- Background removal
- Object removal tools

### 📄 Resume Analysis
- Upload PDF resumes
- Extract and analyze content
- AI-generated feedback & suggestions

### 📊 User Dashboard
- Paginated content history
- Activity tracking
- Clean UI for managing outputs

### ❤️ Community Interaction
- Like / Unlike content
- Engagement tracking system

### 🔐 Authentication
- Clerk-based authentication
- JWT-secured backend APIs

### ☁️ File Upload System
- Multer for handling uploads
- Cloudinary for storage & delivery

---

## 🧠 AI Capabilities

| Feature | Description |
|--------|------------|
| Blog Title Generator | Generates engaging blog titles |
| Article Writer | Produces full articles using AI |
| Image Generator | Creates images from prompts |
| Background Removal | Removes image backgrounds |
| Object Removal | Deletes unwanted objects |
| Resume Analyzer | Provides insights & improvements |

---

## 🏗️ Tech Stack

### 🔹 Frontend
- React (Vite)
- Tailwind CSS
- Clerk Authentication
- Axios
- React Markdown
- React Hot Toast
- Lucide Icons

### 🔹 Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Clerk Middleware (JWT Auth)
- Multer (File Upload)
- Cloudinary (Media Storage)

### 🔹 AI Integration
- Gemini API
- OpenAI API (compatible architecture)
- Clipdrop API 
---

## 📁 Project Structure
```
QuikAI/
│
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── assets/
│ │ 
│ └── public/
│
├── backend/ # Backend (Node + Express)
│ ├── controllers/ # Business logic
│ ├── routes/ # API endpoints
│ ├── middleware/ # Auth, error handling
│ ├── models/ # Mongoose schemas
│ ├── config/ # DB, Cloudinary config
│ └── utils/ # Helpers (PDF parsing, AI)
│
└── README.md
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/quikai.git
cd quikai
```

---

### 2️⃣ Install Dependencies

#### 🔹 Frontend

```bash
cd client
npm install
```

#### 🔹 Backend

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

### 📌 Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection

CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINIAI_API_KEY=your_ai_api_key
CLIPDROP_API_KEY=your_ai_api_key
```

---

### 📌 Frontend `.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=http://localhost:5000
```

---

## ▶️ Running the Project

### 🚀 Start Backend Server

```bash
cd backend
npm run dev
```

### 💻 Start Frontend

```bash
cd client
npm run dev
```

---

## 🔌 API Endpoints

### 🧠 AI Routes (`/api/ai`)

| Method | Endpoint                              | Description                          |
|--------|--------------------------------------|--------------------------------------|
| POST   | `/api/ai/generate-article`           | Generate AI article                  |
| POST   | `/api/ai/generate-blog-title`        | Generate blog titles                 |
| POST   | `/api/ai/generate-image`             | Generate AI image                    |
| POST   | `/api/ai/remove-image-background`    | Remove image background              |
| POST   | `/api/ai/remove-image-object`        | Remove objects from image            |
| POST   | `/api/ai/resume-review`              | Upload & analyze resume (PDF)        |

> ⚠️ **Note:**  
> - Protected via Clerk JWT (`auth` middleware)  
> - File uploads handled using `multer` (`image` / `resume` fields)

---

### 👤 User Routes (`/api/user`)

| Method | Endpoint                              | Description                          |
|--------|--------------------------------------|--------------------------------------|
| GET    | `/api/user/get-user-creations`       | Fetch user's creations               |
| GET    | `/api/user/get-published-creations`  | Fetch all published creations        |
| POST   | `/api/user/toggle-like-creation`     | Like / Unlike a creation             |

---

## 🔐 Important Notes on API Behavior

- 🔐 All routes are protected using **Clerk authentication middleware**
- 📂 File uploads:
  - `image` → for image editing routes
  - `resume` → for resume review
- ❤️ Like system uses a **toggle pattern** (single endpoint for like/unlike)

---


## 🔐 Important Functionality

- ✅ Like/Unlike system with persistent storage  
- 🔐 Secure APIs using Clerk JWT middleware  
- 📂 Efficient file upload handling via Multer  
- 🤖 AI API abstraction (Gemini/OpenAI interchangeable & Clipdrop)  

---

## 🚀 Deployment

| Layer      | Platform           |
|------------|-------------------|
| Frontend   | Vercel            |
| Backend    | Render / Railway  |
| Database   | MongoDB Atlas     |

---

## 📊 Performance & Scalability

- ⚡ Modular architecture for maintainability  
- 🔄 Stateless REST APIs  
- 📈 Scalable MongoDB schema design  
- 🌍 CDN-based media delivery (Cloudinary)  
- 🚀 Optimized frontend with Vite  

---

## 🤝 Contributing

Contributions are welcome.

### Steps:

1. Fork the repository  
2. Create a new branch (`feature/your-feature`)  
3. Commit your changes  
4. Push to your fork  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Subhodeep**

- GitHub: https://github.com/Subhodeep77  

---

## ⭐ Final Note

QuikAI represents a **production-grade AI SaaS architecture**, combining scalable backend services with intelligent AI capabilities. It serves as a strong foundation for building advanced AI-driven applications.
