import { checkResponse } from "./auth";
import { baseUrl } from "./constants";

// const baseUrl = "http://localhost:3001";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    const jwt = localStorage.getItem("jwt");
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    };
    console.log("Request headers:", headers);
    return headers;
  }
  getItems() {
    return fetch(`${this._baseUrl}/items`, {
      headers: this._getHeaders(),
    }).then(checkResponse);
  }

  updateProfile({ name, avatar }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ name, avatar }),
    })
      .then(checkResponse)
      .then((data) => data.data || data);
  }

  addItem(item) {
    return fetch(`${this._baseUrl}/items`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(item),
    }).then(checkResponse);
  }

  deleteItem(id) {
    return fetch(`${this._baseUrl}/items/${id}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(checkResponse);
  }

  toggleCardLike(cardId, isLiked) {
    return fetch(`${this._baseUrl}/items/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._getHeaders(),
    }).then(checkResponse);
  }
}

// Create an instance of the Api class
const api = new Api({
  baseUrl: baseUrl,
});

export { Api, api, baseUrl };
