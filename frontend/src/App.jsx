import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote';
import ViewEditNote from './pages/ViewEditNote';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/new" element={
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/:noteId" element={
          <ProtectedRoute>
            <ViewEditNote />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
