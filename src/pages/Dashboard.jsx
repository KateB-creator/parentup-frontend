import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  logout,
  updateUser,
  deleteUser,
  getNotifications,
  clearNotifications,
} from "../api/auth";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [modificaAttiva, setModificaAttiva] = useState(false);
  const [notifiche, setNotifiche] = useState([]);

  const [curaBambino, setCuraBambino] = useState(() =>
    JSON.parse(localStorage.getItem("curaBambino")) || Array(5).fill(false)
  );

  const [ritornoLavoro, setRitornoLavoro] = useState(() =>
    JSON.parse(localStorage.getItem("ritornoLavoro")) || Array(5).fill(false)
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setEmail(parsed.email);
      } catch (error) {
        console.error("Errore parsing utente:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("curaBambino", JSON.stringify(curaBambino));
  }, [curaBambino]);

  useEffect(() => {
    localStorage.setItem("ritornoLavoro", JSON.stringify(ritornoLavoro));
  }, [ritornoLavoro]);

  useEffect(() => {
    getNotifications()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setNotifiche(res.data);
        }
      })
      .catch((err) => console.error("Errore notifiche:", err));
  }, []);

  const toggleCheckbox = (index, type) => {
    const updated =
      type === "cura" ? [...curaBambino] : [...ritornoLavoro];
    updated[index] = !updated[index];
    type === "cura" ? setCuraBambino(updated) : setRitornoLavoro(updated);
  };

  const handleClearNotifications = () => {
    clearNotifications()
      .then((res) => {
        if (res.data.success) setNotifiche([]);
      })
      .catch((err) => console.error("Errore cancellazione notifiche:", err));
  };

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate("/login");
  };

  const handleModifica = async () => {
    try {
      const payload = { email };
      if (newPassword.trim()) payload.password = newPassword;

      const res = await updateUser(user.id, payload);
      if (res.data.success) {
        const updatedUser = { ...user, email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessaggio("Dati aggiornati con successo.");
        setModificaAttiva(false);
        setNewPassword("");
      } else {
        setMessaggio(res.data.message || "Errore durante l’aggiornamento.");
      }
    } catch {
      setMessaggio("Errore di connessione.");
    }
  };

  const handleCancella = async () => {
    if (
      window.confirm("Vuoi cancellare il tuo account? L’operazione è irreversibile.")
    ) {
      try {
        const res = await deleteUser(user.id);
        if (res.data.success) {
          localStorage.clear();
          navigate("/register");
        } else {
          setMessaggio(res.data.message || "Errore durante la cancellazione.");
        }
      } catch {
        setMessaggio("Errore di connessione.");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5">
      <h1 className="title-welcome">Benvenutə {user.nome} {user.cognome}</h1>
      <p>Questa è la tua dashboard personale.</p>

      <hr />
      <h4>🔔 Le tue notifiche</h4>

      {notifiche.length > 0 ? (
        <div className="alert alert-info">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📩 Notifiche recenti</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearNotifications}
            >
              Segna tutte come lette
            </button>
          </div>
          <ul className="mb-0 mt-2">
            {notifiche.map((n, i) => (
              <li key={i}>
                {n.message} <small className="text-muted">({n.created_at})</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted">Nessuna notifica al momento.</p>
      )}

      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Checklist per la cura del bambino</h5>
          <ul className="list-unstyled">
            {[
              "Allattamento o biberon",
              "Cambio pannolino",
              "Tempo pelle a pelle",
              "Controllo della temperatura",
              "Nanna sicura",
            ].map((item, i) => (
              <li key={i}>
                <input
                  type="checkbox"
                  checked={curaBambino[i]}
                  onChange={() => toggleCheckbox(i, "cura")}
                />{" "}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h5>Checklist per il ritorno al lavoro</h5>
          <ul className="list-unstyled">
            {[
              "Organizzazione allattamento",
              "Baby-sitter o nido confermati",
              "Pianificazione orari e permessi",
              "Preparazione kit lavoro/mamma",
              "Condivisione compiti con il partner",
            ].map((item, i) => (
              <li key={i}>
                <input
                  type="checkbox"
                  checked={ritornoLavoro[i]}
                  onChange={() => toggleCheckbox(i, "lavoro")}
                />{" "}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr />
      <h5>Gestione account</h5>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          disabled={!modificaAttiva}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {modificaAttiva && (
        <div className="mb-3">
          <label>Nuova password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Lascia vuoto per non cambiare"
          />
        </div>
      )}

      <div className="d-flex gap-2">
        {modificaAttiva ? (
          <>
            <button className="btn btn-success" onClick={handleModifica}>
              Salva
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setModificaAttiva(false);
                setNewPassword("");
              }}
            >
              Annulla
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setModificaAttiva(true)}
          >
            Modifica email o password
          </button>
        )}
        <button className="btn btn-danger ms-auto" onClick={handleCancella}>
          Elimina account
        </button>
      </div>

      {messaggio && <div className="alert alert-info mt-3">{messaggio}</div>}

      <hr />
      <button onClick={handleLogout} className="btn btn-outline-danger mt-3">
        Logout
      </button>
    </div>
  );
}
