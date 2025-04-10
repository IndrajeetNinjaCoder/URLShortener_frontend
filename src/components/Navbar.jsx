import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authSlice";

export const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

  const handleLoginClick = () => {
    setShowLoginForm((prev) => !prev);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        setShowLoginForm(false);
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        alert("Login failed: " + err);
      });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-blue-500 font-bold text-xl">URL Shortener</div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {!isLoggedIn && showLoginForm && (
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md animate-slide-down">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};
