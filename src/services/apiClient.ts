const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  static async request(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request Error [${url}]:`, error);
      throw error;
    }
  }

  static get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static put(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}
