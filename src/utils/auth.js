const baseUrl = "http://localhost:3001";

// Check response helper function
const checkResponse = (res) => {
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
  console.log("Attempting login with email:", email);
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      console.log("Login response status:", res.status);
      return checkResponse(res);
    })
    .catch((err) => {
      console.error("Login fetch error:", err);
      throw err;
    });
};
// Check token
export const checkToken = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};
