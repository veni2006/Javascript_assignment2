# 🎓 Student Management System (MERN Stack)

A complete, professional, and beginner-friendly **Student Management System** developed using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js). This project provides an intuitive web interface for managing college student records with real-time CRUD operations, robust form validation, and cloud database persistence.

---

## 📌 Project Objectives

The objective of this project is to develop a reliable academic record management system that allows administrators and educators to:
1. **Register Students**: Add new student profiles with validated academic and personal information.
2. **View Records**: Browse all enrolled students in a responsive, clean dashboard table.
3. **Inspect Profiles**: View individual student details in a detailed profile modal.
4. **Update Information**: Edit existing student records using a shared, pre-populated form.
5. **Delete Records**: Safely remove student records with explicit confirmation dialogs.

---

## 💻 Technologies Used

### **Frontend**
* **React.js 19**: Modern functional components with Hooks (`useState`, `useEffect`, `useCallback`).
* **Vite**: Next-generation frontend build tool and development server.
* **Axios**: Promise-based HTTP client for seamless communication with the backend REST API.
* **HTML5 & CSS3**: Custom blue-and-white college theme, fully responsive without heavy UI frameworks.

### **Backend**
* **Node.js**: JavaScript runtime environment.
* **Express.js 5**: Fast and minimalist backend web framework for RESTful routing and middleware.
* **Mongoose 9**: Object Data Modeling (ODM) library for MongoDB validation and queries.
* **CORS**: Middleware enabling Cross-Origin Resource Sharing.
* **Dotenv**: Secure management of environment variables.
* **Nodemon**: Development utility for automatic server restarts on code changes.

### **Database**
* **MongoDB Atlas**: Managed multi-cloud database cluster for permanent and reliable storage.
* **Database Name**: `student_management`
* **Collection**: `students`

---

## ✨ Features

* **Real-time Dashboard**: Displays total enrolled student count dynamically.
* **Complete CRUD Operations**: Create, Read, Update, and Delete operations fully integrated across frontend, backend, and database.
* **Input Validation**:
  * Required field verification for all fields.
  * Standard email format check (`regex`).
  * Phone number length and format check.
  * Duplicate Student ID / Roll Number prevention (both on client and database index).
* **Interactive UI**:
  * Shared form for both adding and editing student details.
  * Modal popup for viewing individual student records and registration timestamps.
  * Confirmation prompt before deleting any record.
  * Loading spinner and graceful empty states.
  * Auto-dismissing success and error alert banners.
* **Security & Clean Architecture**:
  * Sensitive database credentials are isolated in backend `.env` (excluded from version control).
  * Separation of concerns: Config, Models, Routes, Components, and Services.

---

## 🔄 CRUD Operations

| Operation | Action | HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- | :--- | :--- |
| **CREATE** | Add Student | `POST` | `/api/students` | Validates and stores new student details in MongoDB Atlas |
| **READ** | View All | `GET` | `/api/students` | Retrieves all student records sorted by newest first |
| **READ** | View Single | `GET` | `/api/students/:id` | Retrieves complete details of an individual student by MongoDB ID |
| **UPDATE** | Edit Student | `PUT` | `/api/students/:id` | Updates existing record fields and refreshes the table |
| **DELETE** | Delete Student | `DELETE` | `/api/students/:id` | Removes student permanently after user confirmation |

---

## 📂 Project Structure

```text
StudentManagement/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas Mongoose connection setup
│   ├── models/
│   │   └── Student.js            # Mongoose schema and model definition
│   ├── routes/
│   │   └── studentRoutes.js      # REST API route handlers (GET, POST, PUT, DELETE)
│   ├── server.js                 # Express server configuration and middleware
│   ├── .env.example              # Template for backend environment variables
│   ├── .gitignore                # Backend ignore rules
│   └── package.json              # Backend dependencies and scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentForm.jsx       # Student registration and edit form
│   │   │   ├── StudentList.jsx       # Records table with View, Edit, Delete actions
│   │   │   └── StudentViewModal.jsx  # Modal dialog displaying student details
│   │   ├── services/
│   │   │   └── studentService.js     # Axios API service methods
│   │   ├── App.jsx                   # Main React component and dashboard state
│   │   ├── App.css                   # Custom blue & white responsive theme styles
│   │   ├── index.css                 # Base CSS reset
│   │   └── main.jsx                  # React application entry point
│   ├── index.html                    # Application HTML document
│   ├── vite.config.js                # Vite development server configuration
│   └── package.json                  # Frontend dependencies and scripts
│
├── .gitignore                    # Root Git ignore (excludes node_modules, .env, dist)
└── README.md                     # Complete project documentation
```

---

## 🗄️ MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new cluster (Shared / Free tier).
3. Under **Security** &rarr; **Database Access**, create a database user with read and write permissions.
4. Under **Security** &rarr; **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) or add your current IP address.
5. In your cluster view, click **Connect** &rarr; **Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/student_management?retryWrites=true&w=majority
   ```
6. Add this string into your `backend/.env` file.

---

## 🚀 Installation & Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)
* Active MongoDB Atlas Cluster

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/student-management-system-mern.git
cd student-management-system-mern
```

### Step 2: Configure Backend Environment
Navigate into the backend directory:
```bash
cd backend
```
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Update `.env` with your MongoDB Atlas connection URI:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_management?retryWrites=true&w=majority
```
Install backend dependencies:
```bash
npm install
```

### Step 3: Configure Frontend
In a new terminal, navigate to the frontend directory:
```bash
cd ../frontend
npm install
```

---

## 💻 How to Run the Project

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
The server will start at: `http://localhost:5000`

### 2. Start Frontend Application
In another terminal:
```bash
cd frontend
npm run dev
```
The frontend interface will open at: `http://localhost:5173`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Request Body | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API Health Check | None | `200 OK` |
| `GET` | `/api/students` | Retrieve all students | None | `200 OK` |
| `GET` | `/api/students/:id` | Retrieve single student by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/students` | Register a new student | Student JSON object | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `PUT` | `/api/students/:id` | Update existing student | Updated Student JSON | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/students/:id` | Delete student record | None | `200 OK` / `404 Not Found` |

### Sample Student JSON Request Payload:
```json
{
  "studentId": "CS202401",
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com",
  "phone": "9876543210",
  "department": "Computer Science & Engineering",
  "year": "3rd Year",
  "gender": "Male"
}
```

---


