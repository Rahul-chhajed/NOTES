
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
	const navigate = useNavigate();
    const [displayUser, setDisplayUser] = useState({ name: "", email: "" });
    const [displayNotes, setDisplayNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) {
                    navigate("/login");
                    return;
                }
                setDisplayUser(user);
                
                const response = await axios.get("http://localhost:5000/api/notes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                setDisplayNotes(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching notes:", error);
                setError("Failed to load notes. Please try again.");
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [navigate]);

    const onSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("keepLoggedIn");
        navigate("/login");
    }
  
    const onCreateNote = () => {
        navigate("/Dashboard/new");
    };

    const onDeleteNote = (noteId) => {
        axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
            setDisplayNotes(displayNotes.filter((note) => note._id !== noteId));
        }).catch((error) => {
            console.error("Error deleting note:", error);
            setError("Failed to delete note. Please try again.");
        });
    };

    const viewNote = (noteId) => {
        navigate(`/Dashboard/${noteId}`);
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
				<div style={{ 
					display: "flex", 
					alignItems: "center", 
					justifyContent: "space-between", 
					marginBottom: 24 
				}}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<img src="/top.svg" alt="Dashboard" style={{ width: 36 }} />
						<span style={{ fontWeight: 600, fontSize: 22 }}>Dashboard</span>
					</div>
					<a href="#" onClick={onSignOut} style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none", fontSize: 16 }}>Sign Out</a>
				</div>
				
				<div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: 20, marginBottom: 24 }}>
					<div style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
						Welcome, {displayUser.name} !
					</div>
					<div style={{ color: "#6b7280", fontSize: 16 }}>Email: {displayUser.email}</div>
				</div>
				
				<button
					onClick={onCreateNote}
					style={{ 
                        width: "100%", 
                        padding: "14px 0", 
                        background: "#3b82f6", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 10, 
                        fontWeight: 600, 
                        fontSize: 18, 
                        marginBottom: 24,
                        cursor: "pointer"
                    }}
				>
					Create Note
				</button>
				
				<div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Notes</div>
				
				{isLoading && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>Loading notes...</div>
                )}
                
                {error && (
                    <div style={{ color: "red", textAlign: "center", padding: "10px 0" }}>{error}</div>
                )}
                
				<div>
					{!isLoading && displayNotes.length === 0 && (
                        <div style={{ textAlign: "center", color: "#6b7280", padding: "20px 0" }}>
                            No notes yet. Create your first note!
                        </div>
                    )}
                    
					{displayNotes.map((note) => (
						<div
							key={note._id}
							style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                background: "#fff", 
                                borderRadius: 10, 
                                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", 
                                padding: "12px 16px", 
                                marginBottom: 12 
                            }}
						>
							<span 
                                style={{ flex: 1, fontSize: 16, cursor: "pointer" }}
                                onClick={() => viewNote(note._id)}
                            >
                                {note.title}
                            </span>
							<button
								onClick={() => onDeleteNote(note._id)}
								style={{ 
                                    background: "none", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    marginLeft: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
								title="Delete"
							>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;