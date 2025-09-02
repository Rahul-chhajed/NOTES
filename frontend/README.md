# Notes App

A modern, responsive web application for creating and managing personal notes.

![Notes App Screenshot](Dashboard%20M.png)

## Features

- **User Authentication**
  - Email OTP-based authentication
  - Google Sign-In integration
  - Session management with "Keep me logged in" option

- **Notes Management**
  - Create new notes with title and content
  - View all notes in an organized dashboard
  - Edit existing notes
  - Delete notes
  - Responsive design for mobile and desktop

- **Security**
  - JWT-based authentication
  - Protected routes for authenticated users
  - Secure API endpoints

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Inline CSS for styling (mobile-responsive)
- EmailJS for OTP delivery
- Firebase Authentication for Google Sign-In

### Backend
- Node.js with Express
- MongoDB with Mongoose for data storage
- JWT for authentication
- RESTful API architecture

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
notes/
├── backend/
│   ├── app.js              # Express app setup
│   ├── middleware/         # Auth middleware
│   ├── modules/            # Database models
│   └── routes/             # API routes
└── frontend/
    ├── public/             # Static files
    └── src/
        ├── assets/         # Images and assets
        ├── components/     # Reusable components
        ├── pages/          # Page components
        ├── App.jsx         # Main component
        └── main.jsx        # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and OTP
- `POST /api/auth/google` - Login with Google
- `GET /api/auth/logout` - Logout current user

### Notes
- `GET /api/notes` - Get all notes for logged-in user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Mobile Responsiveness

The application is fully responsive and works well on both desktop and mobile devices. Key mobile-friendly features include:

- Adaptive layouts that adjust to screen size
- Touch-friendly buttons and input fields
- Proper viewport settings
- Optimized font sizes for readability on small screens

## Future Enhancements

- Note categories/tags
- Rich text editing
- Image attachments
- Note sharing capabilities
- Dark mode toggle
- Offline functionality with local storage

## License

MIT