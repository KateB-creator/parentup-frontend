import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, recoverPassword, resetPassword } from '../api/auth';
import "../styles/AuthStyles.css";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [emailVerificata, setEmailVerificata] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrore('');
    setRecoveryMessage('');
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

  const handleRecoverPassword = async () => {
    setErrore('');
    setRecoveryMessage('');
    setEmailVerificata(false);

    if (!email) {
      setErrore('Inserisci prima la tua email per il recupero.');
      return;
    }

    try {
      const res = await recoverPassword(email);
      if (res.data.success) {
        setRecoveryMessage("Email verificata. Ora puoi impostare una nuova password.");
        setEmailVerificata(true);
      } else {
        setErrore(res.data.message || "Errore durante il recupero.");
      }
    } catch (err) {
      setErrore("Errore di connessione al server.");
    }
  };

  const handleResetPassword = async () => {
    setErrore('');
    setRecoveryMessage('');
    if (!newPassword) {
      setErrore('Inserisci una nuova password.');
      return;
    }

    try {
      const res = await resetPassword(email, newPassword);
      if (res.data.success) {
        setRecoveryMessage("Password aggiornata con successo. Ora puoi accedere.");
        setEmailVerificata(false);
        setNewPassword('');
      } else {
        setErrore(res.data.message || "Errore durante l'aggiornamento.");
      }
    } catch (err) {
      setErrore("Errore di connessione al server.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left text-center" style={{ backgroundColor: '#fff3cd' }}>
        <div className="p-5">
          <img src="../assets/logo.svg" alt="Logo ParentUp" style={{ maxWidth: '300px', marginBottom: '20px' }} />
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
          {recoveryMessage && <div className="alert alert-success">{recoveryMessage}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Indirizzo email</label>
              <input type="email" className="form-control rounded-pill" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {!emailVerificata && (
              <>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" className="form-control rounded-pill" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-link text-danger p-0" onClick={handleRecoverPassword}>
                    Password dimenticata?
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill">Accedi</button>
              </>
            )}

            {emailVerificata && (
              <>
                <div className="mb-3">
                  <label>Nuova password</label>
                  <input type="password" className="form-control rounded-pill" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <button type="button" className="btn btn-success w-100 rounded-pill" onClick={handleResetPassword}>
                  Imposta nuova password
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
