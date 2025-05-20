import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const API_BASE = "https://parentup.smokatails.it/index.php/api";

// Imposta header se c'è già un token salvato
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// --- USER AUTH ---
export const login = async (email, password) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });

  const { token, user } = res.data;

  // ✅ Decodifica token per estrarre l'ID utente
  const decoded = jwtDecode(token);
  const userId = decoded.sub;

  // ✅ Salva tutto
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("user", JSON.stringify(user));

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return res;
};

export const register = (email, password, nome, cognome, genere, dataNascita) =>
  axios.post(`${API_BASE}/register`, {
    email,
    password,
    nome,
    cognome,
    genere,
    dataNascita,
  });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
  return Promise.resolve();
};

// --- USER INFO ---
export const getUser = (id) =>
  axios.get(`${API_BASE}/users/${id}`);

export const updateUser = (id, { email, password }) =>
  axios.put(`${API_BASE}/users/${id}`, { email, password });

export const deleteUser = (id) =>
  axios.delete(`${API_BASE}/users/${id}`);

export const recoverPassword = (email) =>
  axios.post(`${API_BASE}/recover-password`, { email });

export const resetPassword = (email, newPassword) =>
  axios.post(`${API_BASE}/reset-password`, { email, newPassword });

// --- POSTS ---
export const createPost = (title, content) =>
  axios.post(`${API_BASE}/posts`, { title, content });

export const getPosts = () =>
  axios.get(`${API_BASE}/posts`);

export const getPost = (id) =>
  axios.get(`${API_BASE}/posts/${id}`);

export const updatePost = (id, title, content) =>
  axios.put(`${API_BASE}/posts/${id}`, { title, content });

export const deletePost = (id) =>
  axios.delete(`${API_BASE}/posts/${id}`);

// --- COMMENTS ---
export const createComment = (post_id, content) =>
  axios.post(`${API_BASE}/comments`, { post_id, content });

export const getComments = (post_id) =>
  axios.get(`${API_BASE}/comments?post_id=${post_id}`);

export const updateComment = (id, content) =>
  axios.put(`${API_BASE}/comments/${id}`, { content });

export const deleteComment = (id) =>
  axios.delete(`${API_BASE}/comments/${id}`);

// --- NOTIFICATIONS ---
export const getNotifications = () =>
  axios.get(`${API_BASE}/notifications`);

export const createNotification = (message) =>
  axios.post(`${API_BASE}/notifications`, { message });

export const clearNotifications = () =>
  axios.put(`${API_BASE}/notifications`, {});
