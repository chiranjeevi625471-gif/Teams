# TEAMS Tuitions Backend API

Node.js + Express + MongoDB backend for TEAMS Tuitions website.

## Setup Instructions

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system.
- Download from: https://www.mongodb.com/try/download/community

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `.env` file with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teams_tuitions
NODE_ENV=development
```

### 4. Seed the Database (Optional)
To populate initial course data:
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Inquiries (Contact Form)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit a new inquiry |
| GET | `/api/inquiries` | Get all inquiries (admin) |
| GET | `/api/inquiries/:id` | Get single inquiry |
| PUT | `/api/inquiries/:id` | Update inquiry status |
| DELETE | `/api/inquiries/:id` | Delete inquiry |
| GET | `/api/inquiries/stats/overview` | Get statistics |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:courseId` | Get single course |
| POST | `/api/courses` | Create course (admin) |
| PUT | `/api/courses/:courseId` | Update course |
| DELETE | `/api/courses/:courseId` | Delete course |

## Sample API Requests

### Submit Inquiry
```bash
POST /api/inquiries
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "course": "Regular Tuitions (6-10)",
  "message": "Interested in demo class"
}
```

### Get Course Details
```bash
GET /api/courses/regular-tuitions
```

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- express-validator for validation
- CORS for cross-origin requests
- dotenv for environment variables
