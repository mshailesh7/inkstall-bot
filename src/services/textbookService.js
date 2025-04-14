// src/services/textbookService.js
// Import will be used when connecting to real backend
// import apiClient from './apiClient';

// --- Mock Data (Remove when connecting to real backend) ---
let mockTextbooks = [
    { 
        id: '1', 
        title: 'Complete Physics for Cambridge IGCSE', 
        author: 'Stephen Pople', 
        publisher: 'Oxford University Press',
        edition: '3rd Edition',
        publicationYear: 2014,
        isbn: '978-0198308713',
        subjectId: '1', // IGCSE Physics
        createdAt: new Date().toISOString(),
        coverImageUrl: 'https://m.media-amazon.com/images/I/51JRoV5WPIL._SX258_BO1,204,203,200_.jpg'
    },
    { 
        id: '2', 
        title: 'Cambridge IGCSE Mathematics: Core & Extended', 
        author: 'Karen Morrison, Nick Hamshaw', 
        publisher: 'Cambridge University Press',
        edition: '4th Edition',
        publicationYear: 2018,
        isbn: '978-1108437189',
        subjectId: '3', // IGCSE Mathematics
        createdAt: new Date().toISOString(),
        coverImageUrl: 'https://m.media-amazon.com/images/I/51PqKzZnrqL._SX258_BO1,204,203,200_.jpg'
    },
    { 
        id: '3', 
        title: 'Cambridge IGCSE Mathematics: Extended Practice Book', 
        author: 'Karen Morrison', 
        publisher: 'Cambridge University Press',
        edition: '2nd Edition',
        publicationYear: 2013,
        isbn: '978-1107672727',
        subjectId: '3', // IGCSE Mathematics
        createdAt: new Date().toISOString(),
        coverImageUrl: 'https://m.media-amazon.com/images/I/41KvKS-QZSL._SX258_BO1,204,203,200_.jpg'
    }
];
let nextId = 4;
// --- End Mock Data ---

/**
 * Fetches all textbooks from the backend.
 * @returns {Promise<Array>} Promise resolving to an array of textbooks
 */
export const getAllTextbooks = async () => {
    console.log('Fetching all textbooks...');
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay
    console.log('Fetched all textbooks successfully (mock).');
    return [...mockTextbooks]; // Return a copy
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.get('/textbooks');
        console.log('Fetched all textbooks successfully.');
        return response.data;
    } catch (error) {
        console.error("Error fetching textbooks:", error);
        throw new Error("Could not retrieve textbooks from the server.");
    }
    */
};

/**
 * Fetches textbooks for a specific subject from the backend.
 * @param {string} subjectId - The ID of the subject to fetch textbooks for.
 * @returns {Promise<Array>} Promise resolving to an array of textbooks
 */
export const getTextbooksBySubject = async (subjectId) => {
    console.log(`Fetching textbooks for subject ${subjectId}...`);
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const filteredTextbooks = mockTextbooks.filter(textbook => textbook.subjectId === subjectId);
    console.log(`Fetched ${filteredTextbooks.length} textbooks for subject ${subjectId} (mock).`);
    return [...filteredTextbooks]; // Return a copy
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.get(`/subjects/${subjectId}/textbooks`);
        console.log(`Fetched textbooks for subject ${subjectId} successfully.`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching textbooks for subject ${subjectId}:`, error);
        throw new Error("Could not retrieve textbooks for this subject.");
    }
    */
};

/**
 * Fetches a single textbook by its ID from the backend.
 * @param {string} id - The ID of the textbook to fetch.
 * @returns {Promise<Object>} Promise resolving to the textbook
 */
export const getTextbook = async (id) => {
    console.log(`Fetching textbook ${id}...`);
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const textbook = mockTextbooks.find(textbook => textbook.id === id);
    if (!textbook) {
        throw new Error(`Textbook with ID ${id} not found.`);
    }
    console.log(`Fetched textbook ${id} successfully (mock).`);
    return { ...textbook }; // Return a copy
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.get(`/textbooks/${id}`);
        console.log(`Fetched textbook ${id} successfully.`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching textbook ${id}:`, error);
        throw new Error("Could not retrieve the textbook.");
    }
    */
};

/**
 * Adds a new textbook to the backend.
 * @param {Object} textbookData - The data for the new textbook.
 * @returns {Promise<Object>} Promise resolving to the created textbook
 */
export const addTextbook = async (textbookData) => {
    console.log('Adding textbook:', textbookData);
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Validate input
    if (!textbookData.title || !textbookData.author || !textbookData.publisher || !textbookData.subjectId) {
        throw new Error("Title, author, publisher, and subject are required.");
    }
    
    const newTextbook = {
        ...textbookData,
        id: String(nextId++),
        createdAt: new Date().toISOString(),
    };
    
    mockTextbooks.push(newTextbook);
    console.log('Added textbook successfully (mock).');
    return newTextbook;
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.post('/textbooks', textbookData);
        console.log('Added textbook successfully.');
        return response.data;
    } catch (error) {
        console.error("Error adding textbook:", error);
        throw new Error(error.response?.data?.message || "Could not add the textbook.");
    }
    */
};

/**
 * Updates an existing textbook in the backend.
 * @param {string} id - The ID of the textbook to update.
 * @param {Object} textbookData - The updated data for the textbook.
 * @returns {Promise<Object>} Promise resolving to the updated textbook
 */
export const updateTextbook = async (id, textbookData) => {
    console.log(`Updating textbook ${id}:`, textbookData);
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Find the textbook to update
    const textbookIndex = mockTextbooks.findIndex(t => t.id === id);
    if (textbookIndex === -1) {
        throw new Error(`Textbook with ID ${id} not found.`);
    }
    
    // Update the textbook
    const updatedTextbook = {
        ...mockTextbooks[textbookIndex],
        ...textbookData,
        // Preserve the id and createdAt
        id: mockTextbooks[textbookIndex].id,
        createdAt: mockTextbooks[textbookIndex].createdAt,
    };
    
    mockTextbooks[textbookIndex] = updatedTextbook;
    console.log('Updated textbook successfully (mock).');
    return updatedTextbook;
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.put(`/textbooks/${id}`, textbookData);
        console.log('Updated textbook successfully.');
        return response.data;
    } catch (error) {
        console.error("Error updating textbook:", error);
        throw new Error(error.response?.data?.message || "Could not update the textbook.");
    }
    */
};

/**
 * Deletes a textbook from the backend.
 * @param {string} id - The ID of the textbook to delete.
 * @returns {Promise<void>}
 */
export const deleteTextbook = async (id) => {
    console.log(`Deleting textbook ${id}`);
    
    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Find the textbook to delete
    const textbookIndex = mockTextbooks.findIndex(t => t.id === id);
    if (textbookIndex === -1) {
        throw new Error(`Textbook with ID ${id} not found.`);
    }
    
    // Delete the textbook
    mockTextbooks.splice(textbookIndex, 1);
    console.log('Deleted textbook successfully (mock).');
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        await apiClient.delete(`/textbooks/${id}`);
        console.log('Deleted textbook successfully.');
    } catch (error) {
        console.error("Error deleting textbook:", error);
        throw new Error(error.response?.data?.message || "Could not delete the textbook.");
    }
    */
};