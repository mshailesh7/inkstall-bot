// src/types/paper.js

// Add possible values as needed, align with backend expectations
// const QuestionType = 'MCQ' | 'Structured' | 'Short Answer' | 'Essay' | 'Data Response';
// const DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
// const AssessmentObjective = 'AO1' | 'AO2' | 'AO3'; // Example AOs

// Interface removed, using JSDoc comments for documentation
/**
 * @typedef {Object} PaperGenerationConfig
 * @property {string} subjectId
 * @property {string} topics - Simple text for now, could be array later
 * @property {number} numQuestions
 * @property {Array<string>} questionTypes
 * @property {string} difficulty
 * @property {Array<string>} [targetAOs] - Optional
 * @property {string} [commandWords] - Optional, free text for now
 * @property {string} paperTitle
 * @property {number} [totalMarks] - Optional
 * @property {number} [timeLimit] - Optional, in minutes
 */