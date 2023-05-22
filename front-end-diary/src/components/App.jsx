import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import Home from "./Home/Home";
import Login from "./auth/Login";
import Registration from "./auth/Registration";

const api = axios.create({
  baseURL: "http://localhost:4200/api",
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [loginError, setLoginError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      setIsLoggedIn(true);
    } catch (error) {
      if (error.response.status === 404) {
        console.log("Пользователь с таким email не найден");
        setLoginError("Пользователь с таким email не найден");
      } else if (error.response.status === 401) {
        setLoginError("Неправильный email или пароль");
      } else {
        setLoginError("Произошла ошибка при входе в систему");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
  };

  const handleRegistration = async (email, password) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setShowRegistration(false);
      setIsLoggedIn(true);
    } catch (error) {
      setRegistrationError(error.response.data.message);
    }
  };

  return (
    <div className="main">
      {!isLoggedIn && showRegistration ? (
        <Registration
          onRegistration={handleRegistration}
          registrationError={registrationError}
        >
          <button
            className="swithAuth"
            onClick={() => setShowRegistration(true)}
          >
            Есть аккаунт?
          </button>
        </Registration>
      ) : !isLoggedIn ? (
        <Login onLogin={handleLogin} loginError={loginError}>
          <button
            className="swithAuth"
            onClick={() => setShowRegistration(true)}
          >
            Нет аккаунта?
          </button>
        </Login>
      ) : (
        <Home onLogout={handleLogout} />
      )}
      {!isLoggedIn && !showRegistration ? (
        <button className="swithAuth" onClick={() => setShowRegistration(true)}>
          Нет аккаунта?
        </button>
      ) : !isLoggedIn ? (
        <button
          className="swithAuth"
          onClick={() => setShowRegistration(false)}
        >
          Есть аккаунт?
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
