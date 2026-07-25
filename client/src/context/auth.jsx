import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({
    user: null,
    token: null
  });

  //  Load auth from localStorage on first render
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);

      setAuth({
        user: parseData.user,
        token: parseData.token
      });

      //  Set axios header immediately
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${parseData.token}`;
    }
  }, []);

  //  Update axios header whenever token changes
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };