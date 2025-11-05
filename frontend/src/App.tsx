import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/signUp';
import SignIn from './pages/singIn';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
