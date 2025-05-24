import React from 'react';
import { useNavigate } from 'react-router-dom';
import biglogo from "../assets/Big Logo.svg";
import "../style/test.css";

// Type Definitions
interface ApiResponse {
  token?: string;
  error?: string;
}

// Login Component
export default function Login() {
  const [user, setUser] = React.useState<string>(''); // Changed from email to user
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}security/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }), // Send user instead of email
      });
      const text = await response.text(); // Get the response as plain text
      const cleanedText = text.replace(/^Connected successfully\s*/, '').trim(); // Remove "Connected successfully"
      const data: ApiResponse = JSON.parse(cleanedText); // Parse the cleaned response

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', user); // <-- Save the username
        navigate('/dashboard/welcome'); // Navigate to the welcome page
      } else {
        throw new Error('Token is missing in the response');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid credentials');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="main flex flex-col items-center justify-center">
      <div className="login_form flex flex-col items-center justify-center border-4 border-amber-500 ">
          <img src={biglogo} alt="Logo" className="w-50 h-30 mb-4" />
          <span className="text-3xl text-amber-500 font-bold">SYSTEM LOGIN</span>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="flex flex-col items-center justify-center" onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="border-2 border-amber-500 rounded-lg p-2 m-2"
              placeholder='Username'
              required
              aria-label="Username"
            />
          </div>
          <div className="mb-4">
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-amber-500 rounded-lg p-2 m-2"
              placeholder='Password'
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className="login_button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

