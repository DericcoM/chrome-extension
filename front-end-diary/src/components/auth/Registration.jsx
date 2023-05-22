import React, { useState } from "react";

function Registration({ onRegistration, registrationError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email ?? password) {
      if (!validateEmail(email)) {
        setEmailError("Некорректный email адрес");
        return;
      }
      await onRegistration(email, password);
    } else setRegError("Поля должны быть заполнены");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="auth">
      <h1 className="authTitle">Регистрация</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="formInput">
          <label htmlFor="email" className="formLabel">
            Email:
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="formInputField"
          />
          {emailError && (
            <div className="emailError" style={{ color: "red" }}>
              {emailError}
            </div>
          )}
        </div>
        <div className="formInput">
          <label htmlFor="password" className="formLabel">
            Пароль:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="formInputField"
          />
        </div>

        {registrationError && (
          <div style={{ color: "red" }}>{registrationError}</div>
        )}
        {regError && <div style={{ color: "red" }}>{regError}</div>}

        <button type="submit" className="formButton">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default Registration;
