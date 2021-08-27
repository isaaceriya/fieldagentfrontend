const BASE_URL = "http://localhost:8080/api/agent";
const HEADERS = {
  "Content-Type": "application/json",
};

// TODO: Handle errors with Promise.reject()
// TODO: Use a library like 'axios' or 'ky' 👈🏾 🤓 to simplify this and automatically handle some errors
export default {
  async index() {
    const response = await fetch(BASE_URL);
    if (response.status >= 400) {
      return Promise.reject();
    }

    return response.json();
  },
  async create(payload) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  // TODO: Handle errors with Promise.reject()
  async update(payload) {
    const response = await fetch(`${BASE_URL}/${payload.agentId}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(payload),
    });

    if (response.status >= 400) {
      return Promise.reject();
    }
  },
  delete(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
