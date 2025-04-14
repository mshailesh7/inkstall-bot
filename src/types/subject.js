// src/types/subject.js

/**
 * @typedef {Object} Subject
 * @property {string} id - Use string for IDs usually, can be number if backend uses integers
 * @property {string} name
 * @property {string} code - e.g., "0625" for Physics
 * @property {string} [createdAt] - ISO date string (optional)
 * @property {number} [textbookCount] - Example of potential extra info
 */

/**
 * @typedef {Object} NewSubjectData
 * @property {string} name
 * @property {string} code
 */