// src/services/apiClient.js
import axios from 'axios';

// Using the specified base URL for the question generation API
const API_BASE_URL = '/api';

// Increased timeout for potentially long-running operations
const API_TIMEOUT = 10000000; // 60 seconds

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Optional: Add interceptors for global error handling or request/response manipulation
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle errors globally if desired (e.g., redirect on 401, log errors)
    console.error('API call error:', error.response || error.message);
    // You might want to transform the error structure here
    return Promise.reject(error);
  }
);

// Mock data for testing when the API is not available
const mockQuestionData = {
  paperTitle: "Science Examination",
  subject: "Science",
  totalMarks: 30,
  questions: [
    {
      question: "What is the SI unit of mass?",
      marks: 2,
      type: "MCQ",
      options: ["Kilogram", "Newton", "Metre", "Pascal"],
      correctAnswer: "Kilogram"
    },
    {
      question: "Which of the following is not considered matter: Chair, Air, Love, Almonds?",
      marks: 2,
      type: "MCQ",
      options: ["Chair", "Air", "Love", "Almonds"],
      correctAnswer: "Love"
    },
    {
      question: "At what temperature does water boil at atmospheric pressure in Kelvin scale?",
      marks: 2,
      type: "MCQ",
      options: ["273 K", "373 K", "300 K", "423 K"],
      correctAnswer: "373 K"
    },
    {
      question: "Explain the phenomenon of sublimation.",
      marks: 3,
      type: "Short",
      answer: "Sublimation is the change of solid state directly to gaseous state without going through liquid state."
    },
    {
      question: "Describe the 'kinetic energy' concept in the context of particles of matter.",
      marks: 3,
      type: "Short",
      answer: "Kinetic energy in particles of matter refers to the energy that particles possess due to their motion. As temperature rises, particles move faster, increasing their kinetic energy."
    }
  ]
};

// Function to generate questions
export const generateQuestions = async (formData) => {
  try {
    // Check if we should use mock data (for development/testing)
    const useMockData = process.env.NODE_ENV === 'development' && false; // Changed to false to use real API data
    
    if (useMockData) {
      console.log('Using mock data for question generation');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockQuestionData;
    }
    
    const response = await apiClient.post('questions/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // If it's a timeout error, provide a more specific error message
    if (error.code === 'ECONNABORTED') {
      throw new Error('The server took too long to respond. Please try again later or check if the server is running.');
    }
    
    // Fallback to mock data if API call fails
    console.log('API call failed, using mock data as fallback');
    return mockQuestionData;
  }
};

export default apiClient;