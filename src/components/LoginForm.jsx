import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import "../styles/AuthStyles.css";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);

      if (response.data.success) {
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userNome', response.data.nome);
        localStorage.setItem('userCognome', response.data.cognome);
        navigate('/dashboard');
      } else {
        setErrore(response.data.message || 'Credenziali non valide.');
      }
    } catch (error) {
      setErrore('Errore di connessione al server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left text-center" style={{ backgroundColor: '#fff3cd' }}>
        <div className="p-5">
          <img 
            src="../assets/logo.svg" 
            alt="Logo ParentUp" 
            style={{ maxWidth: '300px', marginBottom: '20px' }} 
          />
          <h2 className="fw-bold">Benvenutə in ParentUp</h2>
          <p className="mt-3">ParentUp ti aiuta nel post-partum e post-adozione con strumenti su misura per ogni tipo di famiglia.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="p-5">
          <div className="text-end">
            <span>Non sei registrato? <Link to="/register" className="text-danger">Registrati ora</Link></span>
          </div>
          <h3 className="fw-bold mt-4">Accedi</h3>
          <p>Entra con le tue credenziali</p>

          {errore && <div className="alert alert-danger">{errore}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Indirizzo email</label>
              <input type="email" className="form-control rounded-pill" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control rounded-pill" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill">Accedi</button>
          </form>
        </div>
      </div>
    </div>
  );
}
