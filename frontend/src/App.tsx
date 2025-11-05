import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp";
import SignIn from "./pages/singIn";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
