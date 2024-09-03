import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useLoginUserMutation } from "../state/api/userApi";
import { setCredentials } from "../state/slice/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await loginUser(formData).unwrap();
      dispatch(setCredentials(data));
      toast.success("Login successful");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 p-4">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h1 className="mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
