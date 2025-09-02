import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNote = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating note:", error);
      setError("Failed to create note. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#fff", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "480px", 
        margin: "0 auto", 
        padding: "16px", 
        boxSizing: "border-box" 
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#3b82f6" />
              <path d="M9 16L14 21L23 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 22 }}>Create Note</span>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#3b82f6", 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: "pointer" 
            }}
          >
            Cancel
          </button>
        </div>

        {error && (
          <div style={{ 
            background: "#FEE2E2", 
            color: "#B91C1C", 
            padding: "10px 16px", 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label 
              htmlFor="title" 
              style={{ 
                display: "block", 
                fontSize: 16, 
                fontWeight: 500, 
                marginBottom: 6 
              }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                fontSize: 16,
                outline: "none",
              }}
              placeholder="Enter note title"
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label 
              htmlFor="content" 
              style={{ 
                display: "block", 
                fontSize: 16, 
                fontWeight: 500, 
                marginBottom: 6 
              }}
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                fontSize: 16,
                minHeight: 150,
                resize: "vertical",
                outline: "none",
              }}
              placeholder="Enter note content"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 18,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Creating..." : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
