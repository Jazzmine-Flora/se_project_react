const baseUrl = "http://localhost:3001";

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
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  updateProfile({ name, avatar }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ name, avatar }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  addItem(item) {
    return fetch(`${this._baseUrl}/items`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(item),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  deleteItem(id) {
    return fetch(`${this._baseUrl}/items/${id}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  toggleCardLike(cardId, isLiked) {
    return fetch(`${this._baseUrl}/items/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._getHeaders(),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }
}

// Create an instance of the Api class
const api = new Api({
  baseUrl: baseUrl,
});

export { Api, api, baseUrl };
