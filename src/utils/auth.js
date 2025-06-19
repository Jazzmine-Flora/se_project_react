import { baseUrl } from "./constants";
// const baseUrl = "http://localhost:3001";

// Check response helper function
export const checkResponse = (res) => {
  return res.json().then((data) => {
    if (res.ok) {
      return data;
    }
    return Promise.reject(data);
  });
};
// Register new user
export const register = ({ name, avatar, email, password }) => {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, avatar, email, password }),
  }).then(checkResponse);
};
export const login = ({ email, password }) => {
  console.log("Attempting login with:", { email });
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(checkResponse) // Use the checkResponse helper
    .then((data) => {
      console.log("Login successful, received data:", data);
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        return data;
      }
      return Promise.reject("No token received");
    });
};
// Check token
export const checkToken = (token) => {
  console.log("Checking token:", token);
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse); // Use the checkResponse helper
};
