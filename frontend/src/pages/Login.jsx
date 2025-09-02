import React, { useState } from "react";
import emailjs from "emailjs-com";
import { SERVICE_ID, TEMPLATE_ID, USER_ID } from "../config.js";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import { VITE_URL } from '../config.js';
const googleLogo = "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png";

const Login = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({ email: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimestamp, setOtpTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // Generate a 6-digit OTP
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Send OTP via EmailJS
  const sendOtp = async (e) => {
    e.preventDefault();
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);
    setOtpTimestamp(Date.now());

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: form.email, otp: generatedOtp },
        USER_ID
      );
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  // Verify OTP and login
  const verifyOtp = async (e) => {
    e.preventDefault();
    const now = Date.now();

    if (!otpTimestamp || now - otpTimestamp > 5 * 60 * 1000) {
      setError("OTP expired. Please request a new one.");
      return;
    }

    if (form.otp === otp) {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(`${VITE_URL}/api/auth/login`, {
          email: form.email,
        });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (keepLoggedIn) localStorage.setItem("keepLoggedIn", "true");
          Navigate("/Dashboard");
          return;
        }
        setError("Login failed. Try again.");
      } catch (err) {
        setError("Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Incorrect OTP. Try again.");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(`${VITE_URL}/api/google-auth/google`, { idToken });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        Navigate("/Dashboard");
        return;
      } else {
        setError("Google sign-in failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
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
          <img src="/top.svg" alt="HD" style={{ width: 36, marginBottom: 8 }} />
          <span style={{ fontWeight: 600, fontSize: 22 }}>HD</span>
        </div>
        <h1 style={{ fontWeight: 700, fontSize: 28, textAlign: "center", marginBottom: 8 }}>Sign In</h1>
        <p style={{ color: "#6b7280", textAlign: "center", marginBottom: 24 }}>Please login to continue to your account.</p>

        <form onSubmit={otpSent ? verifyOtp : sendOtp}>
          <label style={{ fontSize: 14, color: "#2563eb", fontWeight: 500 }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ width: "100%", marginBottom: 16, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #2563eb", fontSize: 16, background: "#fff" }}
          />

          {otpSent && (
            <>
              <label style={{ fontSize: 14, color: "#2563eb", fontWeight: 500 }}>OTP</label>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #2563eb", fontSize: 16, background: "#fff" }}
                />
                <span style={{ position: "absolute", right: 12, top: 14, color: "#6b7280", cursor: "pointer" }}>👁️</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <a href="#" onClick={sendOtp} style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 500, fontSize: 14 }}>Resend OTP</a>
              </div>
            </>
          )}

          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={e => setKeepLoggedIn(e.target.checked)}
              disabled={loading}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 15, color: "#222" }}>Keep me logged in</span>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", background: "#377dff", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
            {loading ? "Loading..." : otpSent ? "Sign In" : "Get OTP"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} disabled={loading} style={{ width: "100%", padding: "12px 0", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500, fontSize: 16, marginBottom: 16 }}>
          <img src={googleLogo} alt="Google" style={{ width: 22, height: 22 }} />
          Sign in with Google
        </button>

        {error && <div style={{ color: "red", marginTop: 8, textAlign: "center" }}>{error}</div>}

        <div style={{ marginTop: 16, textAlign: "center", color: "#6b7280", fontSize: 15 }}>
          Need an account? <a href="/register" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 500 }}>Create one</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
