import axios from 'axios';

const API_URL = 'http://localhost:1337';

const getItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/example`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
    throw error;
  }
};

export { getItems };

// Still copy pasted from chat gpt, need to make changes for our system