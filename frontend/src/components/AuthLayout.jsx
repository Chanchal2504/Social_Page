import "../styles/auth.css";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
