const baseUrl = "http://localhost:3001";

function getItems() {
  return fetch(`${baseUrl}/items`).then((response) => {
    return response.ok
      ? response.json()
      : Promise.reject("Error: ${response.status}");
  });
}

function addItem(item) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Error: ${response.status}`);
  });
}

function deleteItem(id) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
  }).then((response) => {
    return response.ok
      ? response.json()
      : Promise.reject("Error: ${response.status}");
  });
}

const api = {
  getItems,
  addItem,
  deleteItem,
};

export { getItems, addItem, deleteItem };
