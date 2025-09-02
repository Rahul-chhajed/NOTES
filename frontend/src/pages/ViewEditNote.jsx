import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewEditNote = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setTitle(response.data.title);
        setContent(response.data.content);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to load note. Please try again.");
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

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
      await axios.put(
        `http://localhost:5000/api/notes/${noteId}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setIsEditing(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting note:", error);
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p>Loading note...</p>
      </div>
    );
  }

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
            <span style={{ fontWeight: 600, fontSize: 22 }}>{isEditing ? "Edit Note" : "View Note"}</span>
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
            Back
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

        {isEditing ? (
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
              />
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#f3f4f6",
                  color: "#4b5563",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ 
              background: "#fff", 
              borderRadius: 10, 
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", 
              padding: "16px", 
              marginBottom: 16 
            }}>
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                marginBottom: 12 
              }}>
                {title}
              </h2>
              <p style={{ 
                fontSize: 16, 
                lineHeight: 1.5, 
                whiteSpace: "pre-wrap" 
              }}>
                {content}
              </p>
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEditNote;
