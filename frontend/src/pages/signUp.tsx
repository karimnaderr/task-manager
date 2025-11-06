import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import { validatePassword, validateName, validateEmail } from "../utils/validation";
import { inputClass } from "../utils/formClasses";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const firstNameError = validateName(firstName);
    const lastNameError = validateName(lastName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    // Set errors state
    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError,
    });

    // Stop submission if any error
    if (firstNameError || lastNameError || emailError || passwordError) {
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post("/auth/register", { firstName, lastName, email, password });
      alert("Registration successful! Please sign in.");
      setErrors({ firstName: "", lastName: "", email: "", password: "" });
      navigate("/signin", { replace: true });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err?.response?.data?.message || "Registration failed",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <h2 className="mb-4">Sign Up</h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* First Name */}
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={inputClass(firstName, errors.firstName)}
                  value={firstName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFirstName(val);
                    setErrors((prev) => ({
                      ...prev,
                      firstName: validateName(val),
                    }));
                  }}
                  required
                />
                {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={inputClass(lastName, errors.lastName)}
                  value={lastName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLastName(val);
                    setErrors((prev) => ({
                      ...prev,
                      lastName: validateName(val),
                    }));
                  }}
                  required
                />
                {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={inputClass(email, errors.email)}
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(val),
                    }));
                  }}
                  required
                />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className={inputClass(password, errors.password)}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    setErrors((prev) => ({
                      ...prev,
                      password: validatePassword(val),
                    }));
                  }}
                  required
                />
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="mb-0">
                Already have an account? <Link to="/signin">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default SignUp;
