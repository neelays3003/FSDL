# Student Feedback Review System

A comprehensive full-stack web application for managing student feedback on faculty performance. The system allows administrators to manage academic divisions, subjects, and faculty assignments, while students can provide detailed feedback through an intuitive interface.

## Features

### Admin Features
- **User Management**: Secure admin authentication
- **Division Management**: Create and manage academic divisions
- **Subject Management**: Add and organize subjects with unique codes
- **Faculty Management**: Maintain faculty records
- **Assignment Management**: Assign faculty to specific subjects within divisions
- **Analytics Dashboard**: View feedback statistics and charts
- **Feedback Overview**: Monitor all student feedback submissions

### Student Features
- **Registration**: Easy student registration with PRN and email
- **Secure Login**: Authentication using PRN or email
- **Feedback Submission**: Rate faculty on multiple criteria (Quality, Clarity, Interaction, Overall)
- **Comment System**: Optional comments for detailed feedback
- **Assignment Tracking**: View assigned faculty-subject combinations

### System Features
- **Role-based Access Control**: Separate dashboards for admins and students
- **Data Integrity**: Prevents duplicate feedback submissions
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Analytics**: Charts and statistics for feedback analysis

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Lucide React** - Icon library
- **JWT Decode** - Token parsing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Database Setup
Ensure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod
```
Or update your `.env` file to use MongoDB Atlas connection string.

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment-7
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/feedback_db
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Seeding
Seed the admin user:
```bash
cd ../backend
node seed.js
```

## Usage

### Step-by-Step Flow

#### 1. Start the Application
**Backend:**
```bash
cd backend
node server.js
```
The server will start on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`

#### 2. Admin Setup Process
1. **Login as Admin**
   - Navigate to `http://localhost:5173`
   - Click "Login as Admin"
   - Use credentials: `admin@admin.com` / `admin`

2. **Create Divisions**
   - Go to Divisions section
   - Add academic divisions (e.g., "Computer Engineering A", "IT B")

3. **Add Subjects**
   - Navigate to Subjects section
   - Create subjects with name and code (e.g., "Data Structures", "CS201")

4. **Add Faculty**
   - Go to Faculty section
   - Register faculty members with name and email

5. **Create Assignments**
   - In Assignments section
   - Assign faculty to specific subjects within divisions

#### 3. Student Registration and Feedback
1. **Student Registration**
   - Students visit the registration page
   - Provide PRN, full name, email, and password
   - Select their division

2. **Student Login**
   - Students can login using PRN or email
   - Secure authentication with JWT tokens

3. **Submit Feedback**
   - After login, students see their assigned faculty-subject combinations
   - For each assignment, students can:
     - Rate on 4 criteria (1-5 scale)
     - Add optional comments
     - Submit feedback (one-time per assignment)

#### 4. View Analytics
- Admin can view comprehensive feedback analytics
- Charts showing average ratings by faculty, subject, division
- Detailed feedback listings with comments

## API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login (admin/student)

### Admin Routes (Protected)
- `GET /api/admin/divisions` - Get all divisions
- `POST /api/admin/divisions` - Create division
- `GET /api/admin/subjects` - Get all subjects
- `POST /api/admin/subjects` - Create subject
- `GET /api/admin/faculty` - Get all faculty
- `POST /api/admin/faculty` - Create faculty
- `GET /api/admin/assignments` - Get all assignments
- `POST /api/admin/assignments` - Create assignment
- `GET /api/admin/feedback` - Get all feedback
- `GET /api/admin/analytics` - Get feedback analytics

### Student Routes (Protected)
- `GET /api/student/assignments` - Get student's assignments
- `GET /api/student/profile` - Get student profile

### Feedback Routes (Protected)
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:assignmentId` - Get feedback for assignment

## Project Structure

```
assignment-7/
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Assignment.js
│   │   ├── Division.js
│   │   ├── Faculty.js
│   │   ├── Feedback.js
│   │   ├── Student.js
│   │   └── Subject.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── feedback.js
│   │   └── student.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── FeedbackItem.jsx
│   │   │   ├── FeedbackList.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FeedbackFormPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md (this file)
```

## Database Schema

### Core Entities
- **Admin**: System administrators
- **Student**: Registered students with PRN and division
- **Faculty**: Teaching faculty members
- **Division**: Academic divisions/classes
- **Subject**: Course subjects with codes
- **Assignment**: Faculty-subject-division relationships
- **Feedback**: Student feedback on faculty performance

### Relationships
- Student belongs to one Division
- Assignment links Faculty, Subject, and Division
- Feedback links Student, Faculty, Subject, and Assignment

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication
- **Role-based Access**: Separate permissions for admin and student
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (production server)
cd backend
NODE_ENV=production node server.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.</content>
<parameter name="filePath">d:\Avengers Doomsday\Assignment-7\README.md