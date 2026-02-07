import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
    };
    const handleLogin = async () => {
    try {
        const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
        );

        const token = response.data.token;

        localStorage.setItem("token", token);

        navigate("/feed");
    } catch (error) {
        alert(
        error.response?.data?.message || "Login failed"
        );
    }
    };


  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue">
      <form className="auth-form">
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
            onClick={handleLogin}
            >
            Login
        </button>


        <p className="switch-text">
            Don’t have an account?
            <span onClick={() => navigate("/signup")}> Sign up</span>
        </p>

      </form>
    </AuthLayout>
  );
};

export default Login;
