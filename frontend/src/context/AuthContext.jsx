import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("userName");
    
    if (token && userId) {
      setUser({ _id: userId, type: userType, name: userName });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.result._id);
    localStorage.setItem("userType", data.result.type);
    localStorage.setItem("userName", data.result.name);
    setUser(data.result);
    return data;
  };

  const signup = async (payload) => {
    await api.signup(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
