const baseUrl = "http://localhost:3001";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    const jwt = localStorage.getItem("jwt");
    return {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    };
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
}

// Create an instance of the Api class
const api = new Api({
  baseUrl: baseUrl,
});

export { api, baseUrl };
