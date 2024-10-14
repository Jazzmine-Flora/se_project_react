const baseUrl = "http://localhost:3001";

function getItems() {
  return fetch(`${baseUrl}/items`).then((response) => {
    return response.ok
      ? response.json()
      : Promise.reject("Error: ${response.status}");
  });
}

export { getItems };
