import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await axiosClient.get("/auth/me");
      setUserName(res.data.name);
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userFullName");
        navigate("/signin", { replace: true });
      } else {
        setError(err?.response?.data?.message || "Failed to fetch user info");
        console.error("Error fetching user:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    navigate("/signin", { replace: true });
  };

  return {
    userName,
    loading,
    error,
    logout,
  };
};

