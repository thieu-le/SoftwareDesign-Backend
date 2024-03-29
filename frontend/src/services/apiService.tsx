import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

const apiService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(BASE_URL + 'login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // You can handle this error in your component
    }
  },
  fetchData: async () => {
    try {
      const response = await axios.get(BASE_URL + 'data');
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
  registerUser: async (username: string, password: string) => {
    try {
      const response = await axios.post(BASE_URL + 'register', { username, password });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  },
  sendProfileData: async (profileData: any) => {
    try {
      // Make a POST request to the backend API endpoint to send profile data
      const response = await axios.post(BASE_URL + 'profile', profileData);
      // Return the response data if needed
      return response.data;
    } catch (error) {
      // Handle error if the request fails
      console.error('Error sending profile data:', error);
      throw error; // Rethrow the error to handle it in the component
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
      const response = await axios.get(BASE_URL + 'fuelquote/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching fuel quote history:', error);
      throw error; // You can handle this error in your component
    }
  }
};

export default apiService;
