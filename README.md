# Notes Application

A full-stack web application for creating and managing personal notes. This application features user authentication, note creation, editing, and deletion capabilities with a responsive UI for both desktop and mobile users.

## Project Overview

This project is a modern notes application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It allows users to securely manage their personal notes with a clean, intuitive interface.

### Quick Links

- [Frontend Documentation](./frontend/README.md)
- [Backend API Documentation](#backend-api)

## Features

- **Secure User Authentication**
  - Email OTP verification
  - Google Sign-in option
  - JWT-based session management

- **Notes Management**
  - Create, read, update, and delete notes
  - Mobile-responsive interface
  - Real-time updates

- **Modern UI/UX**
  - Clean and intuitive interface
  - Fully responsive design
  - Accessibility-focused

## Screenshots

### Mobile View
![Mobile Dashboard](./frontend/Dashboard%20M.png)

### Sign-in Screen
![Sign In Screen](./frontend/Sign%20In%20M.png)

### Sign-up Screen
![Sign Up Screen](./frontend/Sign%20Up%20M%201.png)

## Project Structure

This project is organized into two main directories:

```
notes/
├── backend/        # Express.js server, MongoDB integration
└── frontend/       # React application with responsive UI
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/notes.git
   cd notes
   ```

2. Set up the backend
   ```bash
   cd backend
   npm install
   ```

3. Set up the frontend
   ```bash
   cd frontend
   npm install
   ```

4. Start both servers
   - For backend: `npm start` in the backend directory
   - For frontend: `npm run dev` in the frontend directory

5. Access the application at `http://localhost:5173`

## Backend API

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and OTP
- `POST /api/auth/google` - Login with Google

### Notes Endpoints
- `GET /api/notes` - Get all notes for logged-in user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Technologies Used

### Frontend
- React.js with Hooks
- React Router for navigation
- EmailJS for OTP delivery
- Firebase Authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

## License

This project is licensed under the MIT License
