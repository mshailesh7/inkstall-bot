// src/services/subjectService.js
// Import will be used when connecting to real backend
// import apiClient from './apiClient';

// --- Mock Data (Remove when connecting to real backend) ---
let mockSubjects = [
    { id: '1', name: 'IGCSE Physics', code: '0625', createdAt: new Date().toISOString(), textbookCount: 1 },
    { id: '2', name: 'IGCSE Chemistry', code: '0620', createdAt: new Date().toISOString(), textbookCount: 0 },
    { id: '3', name: 'IGCSE Mathematics', code: '0580', createdAt: new Date().toISOString(), textbookCount: 2 },
    { id: '4', name: 'IGCSE Biology', code: '0610', createdAt: new Date().toISOString(), textbookCount: 1 },
    { id: '5', name: 'IGCSE English', code: '0500', createdAt: new Date().toISOString(), textbookCount: 3 },
    { id: '6', name: 'IGCSE Geography', code: '0460', createdAt: new Date().toISOString(), textbookCount: 2 },
];
let nextId = 7;
// --- End Mock Data ---

/**
 * Fetches the list of subjects from the backend.
 * @returns {Promise<Array>} Promise resolving to an array of subjects
 */
export const getSubjects = async () => {
    console.log('Fetching subjects...'); // Log API calls

    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay
    // Removed random error simulation for demo purposes
    console.log('Fetched subjects successfully (mock).');
    return [...mockSubjects]; // Return a copy
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.get('/subjects');
        console.log('Fetched subjects successfully.');
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        // Throw a user-friendly error or handle specific error codes
        throw new Error("Could not retrieve subjects from the server.");
    }
    */
};

/**
 * Adds a new subject to the backend.
 * @param {Object} subjectData - The data for the new subject.
 * @returns {Promise<Object>} Promise resolving to the created subject
 */
export const addSubject = async (subjectData) => {
    console.log('Adding subject:', subjectData);

    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (!subjectData.name || !subjectData.code) {
        throw new Error("Subject Name and Code are required.");
    }
    const newSubject = {
        ...subjectData,
        id: String(nextId++),
        createdAt: new Date().toISOString(),
        textbookCount: 0,
    };
    mockSubjects.push(newSubject);
    console.log('Added subject successfully (mock).');
    return newSubject;
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.post('/subjects', subjectData);
        console.log('Added subject successfully.');
        return response.data; // Return the newly created subject from the backend
    } catch (error) {
        console.error("Error adding subject:", error);
        // Provide more specific error feedback if possible (e.g., from error.response.data)
        throw new Error(error.response?.data?.message || "Could not add the subject.");
    }
    */
};

/**
 * Updates an existing subject in the backend.
 * @param {string} id - The ID of the subject to update.
 * @param {Object} subjectData - The updated data for the subject.
 * @returns {Promise<Object>} Promise resolving to the updated subject
 */
export const updateSubject = async (id, subjectData) => {
    console.log(`Updating subject ${id}:`, subjectData);

    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Validate input
    if (!subjectData.name || !subjectData.code) {
        throw new Error("Subject Name and Code are required.");
    }
    
    // Find the subject to update
    const subjectIndex = mockSubjects.findIndex(s => s.id === id);
    if (subjectIndex === -1) {
        throw new Error(`Subject with ID ${id} not found.`);
    }
    
    // Update the subject
    const updatedSubject = {
        ...mockSubjects[subjectIndex],
        ...subjectData,
        // Preserve the id, createdAt, and textbookCount
        id: mockSubjects[subjectIndex].id,
        createdAt: mockSubjects[subjectIndex].createdAt,
        textbookCount: mockSubjects[subjectIndex].textbookCount,
    };
    
    mockSubjects[subjectIndex] = updatedSubject;
    console.log('Updated subject successfully (mock).');
    return updatedSubject;
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        const response = await apiClient.put(`/subjects/${id}`, subjectData);
        console.log('Updated subject successfully.');
        return response.data;
    } catch (error) {
        console.error("Error updating subject:", error);
        throw new Error(error.response?.data?.message || "Could not update the subject.");
    }
    */
};

/**
 * Deletes a subject from the backend.
 * @param {string} id - The ID of the subject to delete.
 * @returns {Promise<void>}
 */
export const deleteSubject = async (id) => {
    console.log(`Deleting subject ${id}`);

    // --- MOCK IMPLEMENTATION (Replace with real API call) ---
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
    
    // Find the subject to delete
    const subjectIndex = mockSubjects.findIndex(s => s.id === id);
    if (subjectIndex === -1) {
        throw new Error(`Subject with ID ${id} not found.`);
    }
    
    // Check if the subject has textbooks
    const textbookCount = mockSubjects[subjectIndex].textbookCount || 0;
    if (textbookCount > 0) {
        throw new Error(`Cannot delete subject with ID ${id} because it has associated textbooks. Please remove all textbooks first.`);
    }
    
    // Delete the subject
    mockSubjects.splice(subjectIndex, 1);
    console.log('Deleted subject successfully (mock).');
    // --- END MOCK ---

    /* --- REAL API CALL ---
    try {
        await apiClient.delete(`/subjects/${id}`);
        console.log('Deleted subject successfully.');
    } catch (error) {
        console.error("Error deleting subject:", error);
        throw new Error(error.response?.data?.message || "Could not delete the subject.");
    }
    */
};