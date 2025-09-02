import React, { useState } from "react";
import emailjs from "emailjs-com";
import {SERVICE_ID,TEMPLATE_ID,USER_ID} from "../config.js";
const googleLogo = "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"; // Use your preferred logo
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
const Signup = () => {
    const Navigate=useNavigate();
  const [form, setForm] = useState({ name: "", dob: "", email: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpTimestamp, setOtpTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate a 6-digit OTP
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);
    setOtpTimestamp(Date.now()); // store timestamp
    try {
      await emailjs.send(
        `${SERVICE_ID}`, // replace with your EmailJS service ID
        `${TEMPLATE_ID}`, // replace with your EmailJS template ID
        {
          to_email: form.email,
          otp: generatedOtp,
          user_name: form.name,
        },
        `${USER_ID}` // replace with your EmailJS user ID
      );
      setOtpSent(true);
      setShowOtp(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if ( !otpTimestamp || now - otpTimestamp > 5 * 60 * 1000) { // 5 minutes
      setError("OTP expired. Please request a new one.");
        return;
    }
    if (userOtp === otp) {
      setOtpVerified(true);
      setError("");
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          name: form.name,
          email: form.email,
          DOB: form.dob
        });
        if (response.status === 201) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          Navigate("/Dashboard");
          setLoading(false);
          return;
        }
        setError("Registration failed. Try again.");
      } catch (err) {
        setError("Registration failed. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Incorrect OTP. Try again.");
    }
  };

  const handleGoogleSignup = async () => {
   
    try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    const response = await axios.post("http://localhost:5000/api/google-auth/google", { idToken });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Navigate("/Dashboard");
      return;
    }
    else {
      setError("Google sign-in failed. Try again.");
      return;
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#fff",
      padding: "16px" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "420px", 
        background: "#fff", 
        borderRadius: 20, 
        boxShadow: "0 2px 12px #e0e7ef", 
        padding: 24, 
        margin: "8px auto" 
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <img src="/public/top.svg" alt="HD" style={{ width: 36, marginBottom: 8 }} />
          <span style={{ fontWeight: 600, fontSize: 22 }}>HD</span>
        </div>
        <h1 style={{ fontWeight: 700, fontSize: 28, textAlign: "center", marginBottom: 8 }}>Sign up</h1>
        <p style={{ color: "#6b7280", textAlign: "center", marginBottom: 24 }}>Sign up to enjoy the feature of HD</p>
  <form onSubmit={otpSent ? verifyOtp : sendOtp}>
          <label style={{ fontSize: 14, color: "#6b7280" }}>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ width: "100%", marginBottom: 16, padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16, background: "#f7f8fa" }}
          />
          <label style={{ fontSize: 14, color: "#6b7280" }}>Date of Birth</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span style={{ position: "absolute", left: 12, top: 14, color: "#2563eb", pointerEvents: "none" }}>📅</span>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: "100%", padding: "12px 16px 12px 36px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16, background: "#f7f8fa" }}
            />
          </div>
          <label style={{ fontSize: 14, color: "#6b7280" }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ width: "100%", marginBottom: showOtp ? 16 : 24, padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16, background: "#f7f8fa" }}
          />
          {showOtp && (
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type="text"
                placeholder="OTP"
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #2563eb", fontSize: 16, background: "#fff" }}
              />
              <span style={{ position: "absolute", right: 12, top: 14, color: "#6b7280", cursor: "pointer" }}>👁️</span>
            </div>
          )}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", background: "#377dff", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
            {loading ? "Loading..." : showOtp ? "Sign up" : "Get OTP"}
          </button>
        </form>
        <button onClick={handleGoogleSignup} style={{ width: "100%", padding: "12px 0", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500, fontSize: 16, marginBottom: 16 }}>
          <img src={googleLogo} alt="Google" style={{ width: 22, height: 22 }} />
          Sign up with Google
        </button>
        {error && <div style={{ color: "red", marginTop: 8, textAlign: "center" }}>{error}</div>}
        <div style={{ marginTop: 16, textAlign: "center", color: "#6b7280", fontSize: 15 }}>
          Already have an account?? <a href="/login" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 500 }}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;