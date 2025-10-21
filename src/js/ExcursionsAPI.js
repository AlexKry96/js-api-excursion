
class ExcursionsAPI {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.headers = { 'Content-Type': 'application/json' };
  }

  
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const message = `Błąd HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('[ExcursionsAPI error]', error);
      throw error;
    }
  }

  /*Wycieczki */

  getExcursions() {
    return this.request('/excursions');
  }

  getExcursion(id) {
    return this.request(`/excursions/${id}`);
  }

  addExcursion(excursion) {
    return this.request('/excursions', {
      method: 'POST',
      body: JSON.stringify(excursion),
    });
  }

  updateExcursion(id, patch) {
    return this.request(`/excursions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  }

  deleteExcursion(id) {
    return this.request(`/excursions/${id}`, { method: 'DELETE' });
  }

  /* --- Zamówienia --- */

  getOrders() {
    return this.request('/orders');
  }

  addOrder(order) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }
}

export default new ExcursionsAPI();