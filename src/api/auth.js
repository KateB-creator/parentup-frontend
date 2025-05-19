import axios from "axios";

// Abilita i cookie di sessione per tutte le richieste
axios.defaults.withCredentials = true;

const API_BASE = "http://3.79.231.191/index.php/api";

// --- USER AUTH ---
export const login = (email, password) =>
  axios.post(`${API_BASE}/login`, { email, password }, { withCredentials: true });

export const register = (email, password, nome, cognome, genere, dataNascita) =>
  axios.post(`${API_BASE}/register`, {
    email,
    password,
    nome,
    cognome,
    genere,
    dataNascita,
  }, { withCredentials: true });

export const logout = () =>
  axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });

// --- USER INFO ---
export const getUser = (id) =>
  axios.get(`${API_BASE}/users/${id}`, { withCredentials: true });

export const updateUser = (id, { email, password }) =>
  axios.put(`${API_BASE}/users/${id}`, { email, password }, { withCredentials: true });

export const deleteUser = (id) =>
  axios.delete(`${API_BASE}/users/${id}`, { withCredentials: true });

export const recoverPassword = (email) =>
  axios.post(`${API_BASE}/recover-password`, { email });

export const resetPassword = (email, newPassword) =>
  axios.post(`${API_BASE}/reset-password`, { email, newPassword });

// --- POSTS ---
export const createPost = (title, content) =>
  axios.post(`${API_BASE}/posts`, { title, content }, { withCredentials: true });

export const getPosts = () =>
  axios.get(`${API_BASE}/posts`, { withCredentials: true });

export const getPost = (id) =>
  axios.get(`${API_BASE}/posts/${id}`, { withCredentials: true });

export const updatePost = (id, title, content) =>
  axios.put(`${API_BASE}/posts/${id}`, { title, content }, { withCredentials: true });

export const deletePost = (id) =>
  axios.delete(`${API_BASE}/posts/${id}`, { withCredentials: true });

// --- COMMENTS ---
export const createComment = (post_id, content, user_id) =>
  axios.post(`${API_BASE}/comments`, { post_id, content, user_id }, { withCredentials: true });

export const getComments = (post_id) =>
  axios.get(`${API_BASE}/comments?post_id=${post_id}`, { withCredentials: true });

export const updateComment = (id, content) =>
  axios.put(`${API_BASE}/comments/${id}`, { content }, { withCredentials: true });

export const deleteComment = (id) =>
  axios.delete(`${API_BASE}/comments/${id}`, { withCredentials: true });

// --- NOTIFICATIONS ---
export const getNotifications = () =>
  axios.get(`${API_BASE}/notifications`, { withCredentials: true });

export const createNotification = (user_id, message) =>
  axios.post(`${API_BASE}/notifications`, { user_id, message }, { withCredentials: true });

export const clearNotifications = () =>
  axios.put(`${API_BASE}/notifications`, {}, { withCredentials: true });
