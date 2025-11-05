import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function SignUp(){
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post("/auth/register", { firstName, lastName, email, password });
      alert("Registered — please sign in");
      navigate("/signin");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <h2>Sign Up</h2>
      <form onSubmit={submit} style={{maxWidth:400}}>
        <div className="mb-3">
          <label className="form-label">First name</label>
          <input className="form-control" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Last name</label>
          <input className="form-control" value={lastName} onChange={e=>setLastName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
    </div>
  );
}
