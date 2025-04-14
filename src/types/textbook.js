// src/types/textbook.js
// import { Subject } from './subject';

/**
 * @typedef {Object} Textbook
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} publisher
 * @property {string} [edition]
 * @property {number} [publicationYear]
 * @property {string} [isbn]
 * @property {string} subjectId
 * @property {Object} [subject]
 * @property {string} createdAt
 * @property {string} [coverImageUrl]
 */

/**
 * @typedef {Object} NewTextbookData
 * @property {string} title
 * @property {string} author
 * @property {string} publisher
 * @property {string} [edition]
 * @property {number} [publicationYear]
 * @property {string} [isbn]
 * @property {string} subjectId
 * @property {string} [coverImageUrl]
 */