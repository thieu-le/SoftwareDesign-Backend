import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

function getCsrfToken() {
  const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement;
  return csrfTokenElement ? csrfTokenElement.value : '';
}

const apiService = {
  registerUser: async (username: string, password: string, csrfToken: string) => {
    try {
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('CSRF Token:', csrfToken);

      const response = await axios.post(BASE_URL + 'register/', { username, password }, {
        headers: {
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
      const csrfToken = getCsrfToken(); // Get CSRF token
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
      const response = await axios.post(BASE_URL + 'client-profiles/', profileData);
      return response.data;
    } catch (error) {
      console.error('Error sending profile data:', error);
      throw error;
    }
  },

  calculateFuelQuote: async (quoteData: {
    gallonsRequested: number;
    deliveryDate: Date | null;
    clientAddress: string;
  }) => {
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
      const csrfToken = getCsrfToken(); // Get CSRF token
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
  }
};

export default apiService;
