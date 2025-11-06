Task Management App

A full-stack Task Management application built with React on the frontend, Express + Prisma on the backend, and MySQL as the database. Users can register, login, and manage their tasks securely.

Table of Contents

Features

Prerequisites

Setup & Running

Project Structure

Validations

Decisions & Rationale

Features

User registration and login with JWT authentication.

CRUD operations for tasks: Create, Read, Update, Delete.

Task completion toggling.

Frontend validations for forms (React).

Backend validations for all user inputs.

Secure password hashing using bcrypt.

Real-time feedback on form input errors.

Prerequisites

Node.js >= 18.x

npm or yarn

MySQL database

Git

Setup & Running
Backend

Clone the repository:

git clone <your-repo-url>
cd <your-repo-name>/backend


Install dependencies:

npm install


Configure environment variables:

Create a .env file in the backend folder:

DATABASE_URL="mysql://user:password@localhost:3306/dbname"
JWT_SECRET=your_jwt_secret
PORT=5000


Run database migrations:

npx prisma migrate dev


Start the backend server:

npm run dev

Frontend

Navigate to the frontend folder:

cd ../frontend


Install dependencies:

npm install


Start the frontend server:

npm start


The app will be available at http://localhost:3000.

Project Structure
Backend

controllers/ – handles incoming requests.

services/ – contains business logic and validation.

middleware/ – authentication and error handling.

prismaClient.ts – Prisma client initialization.

utils/validation.ts – all validation logic.

Frontend

components/ – reusable UI components.

pages/ – main pages (SignUp, SignIn, Dashboard).

hooks/ – custom hooks for API calls.

utils/ – validation and CSS helper functions.

Validations

Frontend:

Registration & login forms validate email, password, and name fields.

Task creation/editing ensures title is not empty and description contains letters and numbers.

Backend:

All inputs are validated before interacting with the database.

Passwords are hashed before saving.

Users cannot create or edit tasks with invalid/empty data.

Decisions & Rationale

Service Layer:
All business logic (task and auth operations) was moved to services to separate concerns and keep controllers thin.

Validation on Backend:
Even though frontend validations exist, backend validation was implemented to ensure security and prevent malicious input.

JWT Authentication:
Used JWT for stateless authentication to simplify frontend-backend communication.

Prisma ORM:
Chosen for type-safe database operations and easier migrations with MySQL.

React State Management:
Simple useState and custom hooks were used instead of Redux for simplicity, as the app scope is limited.

Author

Karim Nader – https://github.com/karimnaderr