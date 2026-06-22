# 💼 HireHub – Full Stack Job Application System

HireHub is a modern full-stack job application platform that connects recruiters with job seekers. It provides secure authentication, role-based access, job posting, job applications, resume management, and a clean user experience built using React and Spring Boot.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT Authentication
- Secure Login & Registration
- Password Encryption
- Spring Security Integration
- Role-Based Authorization

### 👨‍💼 Candidate Features
- Create an Account
- Login Securely
- Browse Available Jobs
- Apply for Jobs
- Upload Resume
- Download Submitted Resume
- Save Jobs for Later
- View Applied Jobs
- Candidate Dashboard

### 🏢 Recruiter Features
- Recruiter Registration
- Login
- Recruiter Dashboard
- Create Job Listings
- Update Job Posts
- Delete Job Posts
- View Posted Jobs
- Manage Applicants

### 🌐 Public Features
- View Available Jobs
- Home Page
- Unauthorized Access Page
- Protected Routes

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

## Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

## Database
- MySQL

## Tools
- Git
- GitHub
- Postman
- VS Code
- IntelliJ IDEA

---

# 📁 Project Structure

```
HireHub
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── security
│   ├── entity
│   ├── dto
│   ├── uploads
│   └── pom.xml
│
└── README.md
```

---

# 🔑 User Roles

### Candidate

- Register/Login
- Browse Jobs
- Apply for Jobs
- Upload Resume
- Save Jobs
- View Applications

### Recruiter

- Register/Login
- Post Jobs
- Edit Jobs
- Delete Jobs
- View Posted Jobs
- Manage Applicants

---

# 🔒 Security

- JWT Token Authentication
- Spring Security
- Protected API Endpoints
- Role-Based Access Control
- Password Encryption

---

# 📡 REST APIs

### Authentication

- Register User
- Login User

### Candidate APIs

- Apply for Job
- Save Job
- View Applications
- Download Resume

### Recruiter APIs

- Create Job
- Update Job
- Delete Job
- View My Jobs

### Public APIs

- View Available Jobs

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/SohanPatil810/Job-Application-System.git
```

---

## Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🌟 Future Enhancements

- Email Notifications
- Resume Parsing
- AI Job Recommendation
- Company Profiles
- Admin Dashboard
- Interview Scheduling
- Real-time Notifications
- Search & Filter Jobs
- Pagination
- Profile Picture Upload

---

# 👨‍💻 Author

**Sohan Patil**

Electronics & Computer Engineering Graduate

GitHub:
https://github.com/SohanPatil810

---

## ⭐ Support

If you found this project useful, please consider giving it a **Star ⭐** on GitHub.
