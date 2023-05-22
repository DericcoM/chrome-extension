import React, { useState } from 'react';
import './auth.css'

function Login({ onLogin, loginError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Некорректный email адрес');
      return;
    }

    await onLogin(email, password);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className='auth'>
      <h1 className='authTitle'>Вход</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='formInput'>
          <label htmlFor="email" className='formLabel'>Email:</label>
          <input
            type="text"
            id="email"
            placeholder='Email'
            value={email}
            onChange={handleEmailChange}
            className='formInputField'
          />
          {emailError && <div className='emailError' style={{ color: 'red' }}>{emailError}</div>}
        </div>

        <div className='formInput'>
          <label htmlFor="password" className='formLabel'>Пароль:</label>
          <input
            type="password"
            id="password"
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='formInputField'
          />
        </div>
        {loginError && <div style={{ color: 'red', paddingBottom: '15px' }}>{loginError}</div>}
        <button type="submit" className='formButton'>Войти</button>
      </form>
    </div>
  );
}

export default Login;

