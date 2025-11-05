import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/singIn";
import SignUp from "../pages/signUp";
import Dashboard from "../pages/dashboard";

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/signin" />} />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/signin"} />} />
    </Routes>
  );
};

export default AppRoutes;
