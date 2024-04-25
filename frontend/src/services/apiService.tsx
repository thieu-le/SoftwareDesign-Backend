import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

const apiService = {
  login: async (username: string, password: string, csrfToken: string) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await axios.post(BASE_URL + 'login/', formData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct content type
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  registerUser: async (username: string, password: string, csrfToken: string) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      const response = await axios.post(BASE_URL + 'register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  fetchData: async () => {
    try {
      const csrfToken = await apiService.getCsrfToken(); // Get CSRF token
      const response = await axios.get(BASE_URL + 'data', {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },

  sendData: async (data: any) => {
    try {
      const response = await axios.post(BASE_URL + 'send', data);
      return response.data;
    } catch (error) {
      console.error('Error sending data:', error);
      return null;
    }
  },

  sendProfileData: async (profileData: any) => {
    try {
      const csrfToken = await apiService.getCsrfToken(); // Get CSRF token
      const response = await axios.post(BASE_URL + 'profile/', profileData, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending profile data:', error);
      throw error;
    }
  },

  calculateFuelQuote: async (quoteData: any) => {
    try {
      const response = await axios.post(BASE_URL + 'calculateFuelQuote', quoteData);
      return response.data;
    } catch (error) {
      console.error('Error calculating fuel quote:', error);
      throw error;
    }
  },

  fetchFuelQuoteHistory: async () => {
    try {
      const csrfToken = await apiService.getCsrfToken(); // Get CSRF token
      const response = await axios.get(BASE_URL + 'fuelquote/history', {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching fuel quote history:', error);
      throw error;
    }
  },

  getCsrfToken: async () => {
    try {
      const response = await axios.get(BASE_URL + 'csrf/token/');
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  }
};

export default apiService;
