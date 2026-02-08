import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
    const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    });
    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
    };
    const handleSignup = async () => {
    try {
        console.log("Signup form data:", form); // Debug log
        await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form
        );

        navigate("/login");
    } catch (error) {
        alert(
        error.response?.data?.message || "Signup failed"
        );
    }
    };



  return (
    <AuthLayout title="Create Account" subtitle="Join the community">
      <form className="auth-form">
        <input
        type="text"
        name="username"
        placeholder="Full Name"
        value={form.username}
        onChange={handleChange}
        />

        <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        />

        <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        />

        <button
        type="button"
        className="primary-btn"
        onClick={handleSignup}
        >
        Sign Up
        </button>


        <p className="switch-text">
            Already have an account?
            <span onClick={() => navigate("/login")}> Login</span>
        </p>

      </form>
    </AuthLayout>
  );
};

export default Signup;
