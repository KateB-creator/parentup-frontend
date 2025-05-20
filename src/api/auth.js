import axios from "axios";

const API_BASE = "https://parentup.smokatails.it/index.php/api";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// --- USER AUTH ---
export const login = async (email, password) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });

  console.log("🔁 Risposta dal login:", res.data); // 👈 stampiamo tutto

  const { token, user } = res.data;

  console.log("📦 token:", token);
  console.log("👤 user:", user);

  localStorage.setItem("token", token);
  localStorage.setItem("userId", user?.id); // salva solo se esiste

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
export const createPost = (title, content, user_id) =>
  axios.post(`${API_BASE}/posts`, { title, content, user_id });

export const getPosts = () =>
  axios.get(`${API_BASE}/posts`);

export const getPost = (id) =>
  axios.get(`${API_BASE}/posts/${id}`);

export const updatePost = (id, title, content, user_id) =>
  axios.put(`${API_BASE}/posts/${id}`, { title, content, user_id });

export const deletePost = (id, user_id) =>
  axios.delete(`${API_BASE}/posts/${id}`, { data: { user_id } });

// --- COMMENTS ---
export const createComment = (post_id, content, user_id) =>
  axios.post(`${API_BASE}/comments`, { post_id, content, user_id });

export const getComments = (post_id) =>
  axios.get(`${API_BASE}/comments?post_id=${post_id}`);

export const updateComment = (id, content, user_id) =>
  axios.put(`${API_BASE}/comments/${id}`, { content, user_id });

export const deleteComment = (id, user_id) =>
  axios.delete(`${API_BASE}/comments/${id}`, { data: { user_id } });

// --- NOTIFICATIONS ---
export const getNotifications = () =>
  axios.get(`${API_BASE}/notifications`);

export const createNotification = (message) =>
  axios.post(`${API_BASE}/notifications`, { message });

export const clearNotifications = () =>
  axios.put(`${API_BASE}/notifications`, {});
