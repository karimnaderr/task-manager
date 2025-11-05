import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { userName, logout } = useAuth();

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Welcome, {userName.toUpperCase() || "User"}!</h2>
      <button className="btn btn-outline-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Header;