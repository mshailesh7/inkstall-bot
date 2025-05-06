/**
 * Paper Patterns Configuration
 * This file contains structured prompts and configurations for different examination boards and paper types
 * Organized by: board -> class/level -> subject -> paper type
 */

const paperPatterns = {
  // IGCSE Paper Patterns
  igcse: {
    // Class 12 (A Level)
    12: {
      biology: {
        paper1:{
prompt_template: `You are a Cambridge IGCSE Biology (0610) assessment specialist.

Generate a **Multiple Choice Extended Tier Paper 2** in the official exam style. Each question should reflect the Cambridge IGCSE format with real-world applications, practical experimental setups, biological process diagrams, and data-based reasoning.

############################################
## INPUT PARAMETERS                       ##
############################################
{
  "paper_title":          "%s",
  "duration_minutes":     45,
  "total_marks":          40,
  "question_types":       ["MCQ"],
  "difficulty":           "%s",
  "number_of_questions":  40
}

############################################
## OUTPUT FORMAT (STRICT JSON ONLY)       ##
############################################
Reply with **only** a valid UTF-8 JSON object; no markdown, no comments.

{
  "paper": {
    "title":            string,
    "code":             "0610/02",
    "tier":             "Extended",
    "type":             "Paper 2 Multiple Choice",
    "duration_minutes": 45,
    "total_marks":      40,
    "instructions": [
      "There are forty questions on this paper. Answer all questions.",
      "For each question there are four possible answers A, B, C and D. Choose the one you consider correct and record your choice in soft pencil on the multiple choice answer sheet.",
      "Follow the instructions on the multiple choice answer sheet.",
      "Write in soft pencil.",
      "Write your name, centre number and candidate number on the multiple choice answer sheet in the spaces provided unless this has been done for you.",
      "Do not use correction fluid.",
      "Do not write on any bar codes.",
      "You may use a calculator."
    ],
    "information": [
      "The total mark for this paper is 40.",
      "Each correct answer will score one mark.",
      "Any rough working should be done on this question paper."
    ]
  },
  "questions": [
    {
      "number": 1,
      "question": string,
      "options": {
        "A": string,
        "B": string,
        "C": string,
        "D": string
      },
      "answer": string,  // Correct option, A-D
    }
    // 40 questions in total
  ]
}

############################################
## RULES                                  ##
############################################
• Questions must reflect official IGCSE Biology Extended style.
• Only use the content from the textbook provided above to generate all questions. Do not use prior knowledge.
• Style should mimic the language, logic, and format of Cambridge MCQs — short stems, real-life scenarios, and process-oriented logic.
• Ensure answer keys are accurate and placed in \`"answer"\`.
• Ensure output is strictly valid UTF-8 encoded JSON. No comments, no markdown, no trailing commas.
`
        },
        paper4: {
          prompt_template: `You are a Cambridge International A Level Biology assessment specialist.

Generate a **Paper 4: Structured Questions** in the official A Level exam format. Each question should require written responses based on higher-order thinking, application of biological principles, data analysis, and experimental evaluation.

############################################
## INPUT PARAMETERS                       ##
############################################
{
  "paper_title":          "Cambridge International A Level Biology Paper 4",
  "duration_minutes":     120,
  "total_marks":          100,
  "question_types":       ["Structured"],
  "difficulty":           "Advanced",
  "number_of_questions":  "30-40 range",
  "marks_per_question":   "2-4 depending on the question"
}

############################################
## OUTPUT FORMAT (STRICT JSON ONLY)       ##
############################################
Reply with **only** a valid UTF-8 JSON object; no markdown, no comments.

{
  "paper": {
    "title":            string,
    "code":             "9700/42",
    "type":             "Paper 4 Structured Questions",
    "duration_minutes": 120,
    "total_marks":      int,
    "instructions": [
      "Answer all questions.",
      "Write your answers in the spaces provided.",
      "You may lose marks if you do not show your working or use biological terms correctly.",
      "You may use a calculator.",
      "You may use a sharp pencil for diagrams or graphs."
    ],
    "information": [
      "The number of marks is given in brackets [ ] at the end of each question or part question.",
      "You are advised to spend approximately 2 minutes per mark.",
      "Use black or blue ink. Do not use correction fluid.",
      "Diagrams should be drawn in pencil."
    ]
  },
  "questions": [
    {
      "number": 1,
      "question": string,
      "marks": int,
      "answer": string
    }
    // … EXACTLY 30-40 items
  ]
}

############################################
## RULES                                  ##
############################################
• Follow the format of Cambridge A Level Biology Paper 4 questions.
• Only use the content from the textbook provided above to generate all questions. Do not use prior knowledge.
• Include data-based, and experimental-evaluation questions.
• Include a comprehensive model \`"answer"\` for each question (concise but mark-worthy).
• Avoid multiple-choice format. Each question should be structured, and show mark allocations.
• Ensure output is strictly valid UTF-8 encoded JSON. No comments, no markdown, no trailing commas.
`
        } 
      }
    },
    10: {
      Physics: {
        paper1:{

            prompt_template: `prompt_template:
You are a Cambridge International A Level Physics (9702) assessment specialist.

Generate a **Multiple Choice Paper 2** in the official exam style. Each question should reflect the Cambridge A Level format with real-world physics applications, practical experimental setups, data interpretation, equations, and diagram-based reasoning. Questions must reflect the style and logic of official past papers, testing depth of understanding across AS and A2 content.

############################################
## INPUT PARAMETERS                       ##
############################################
{
  "paper_title":          "%s",
  "duration_minutes":     60,
  "total_marks":          40,
  "question_types":       ["MCQ"],
  "difficulty":           "%s",
  "number_of_questions":  40
}

############################################
## OUTPUT FORMAT (STRICT JSON ONLY)       ##
############################################
Reply with **only** a valid UTF-8 JSON object; no markdown, no comments.

{
  "paper": {
    "title":            string,
    "code":             "9702/11",
    "tier":             "A Level",
    "type":             "Paper 1 Multiple Choice",
    "duration_minutes": 60,
    "total_marks":      40,
    "instructions": [
      "There are forty questions on this paper. Answer all questions.",
      "For each question there are four possible answers A, B, C and D. Choose the one you consider correct and record your choice in soft pencil on the multiple choice answer sheet.",
      "Follow the instructions on the multiple choice answer sheet.",
      "Write in soft pencil.",
      "Write your name, centre number and candidate number on the multiple choice answer sheet in the spaces provided unless this has been done for you.",
      "Do not use correction fluid.",
      "Do not write on any bar codes.",
      "You may use a calculator."
    ],
    "information": [
      "The total mark for this paper is 40.",
      "Each correct answer will score one mark.",
      "Any rough working should be done on this question paper."
    ]
  },
  "questions": [
    {
      "number": 1,
      "question": string,
      "options": {
        "A": string,
        "B": string,
        "C": string,
        "D": string
      },
      "answer": string
    }
    // 40 questions in total
  ]
}

############################################
## RULES                                  ##
############################################
• Questions must reflect official Cambridge A Level Physics style.
• Only use the content from the textbook content provided above to generate all questions. Do not use prior knowledge.
• Style must mimic official MCQs — real-world context, quantitative reasoning, experimental logic, concise phrasing.
• Use data interpretation, equations, and diagrams when appropriate.
• Ensure answer keys are accurate and placed in \`"answer"\`.
• Ensure output is strictly valid UTF-8 encoded JSON. No comments, no markdown, no trailing commas.
`
        },
        paper4: {
          prompt_template:
          `You are a Cambridge International A Level Physics assessment specialist.

Generate a **Paper 4: Structured Questions** in the official A Level exam format. Each question should require written responses based on higher-order thinking, application of physics principles, data analysis, mathematical problem solving, and experimental evaluation.

############################################
## INPUT PARAMETERS                       ##
############################################
{
  "paper_title":          "Cambridge International A Level Physics Paper 4",
  "duration_minutes":     120,
  "total_marks":          100,
  "question_types":       ["Structured"],
  "difficulty":           "Advanced",
  "number_of_questions":  35,
  "marks_per_question":   "2-4 depending on the question"
}

############################################
## OUTPUT FORMAT (STRICT JSON ONLY)       ##
############################################
Reply with **only** a valid UTF-8 JSON object; no markdown, no comments.

{
  "paper": {
    "title":            string,
    "code":             "9702/42",
    "type":             "Paper 4 Structured Questions",
    "duration_minutes": 120,
    "total_marks":      int,
    "instructions": [
      "Answer all questions.",
      "Write your answers in the spaces provided.",
      "You may lose marks if you do not show your working or use physical principles correctly.",
      "You may use a calculator.",
      "You may use a sharp pencil for diagrams or graphs."
    ],
    "information": [
      "The number of marks is given in brackets [ ] at the end of each question or part question.",
      "You are advised to spend approximately 2 minutes per mark.",
      "Use black or blue ink. Do not use correction fluid.",
      "Diagrams should be drawn in pencil."
    ]
  },
  "questions": [
    {
      "number": 1,
      "question": string,
      "marks": int,              // Between 2 and 4 marks
      "answer": string
    }
    // … EXACTLY 35 items
  ]
}

############################################
## RULES                                  ##
############################################
• Follow the format of Cambridge A Level Physics Paper 4 questions.
• Only use the content from the textbook provided above to generate all questions. Do not use prior knowledge.
• Include data-based, and experimental-evaluation questions.
• Include a comprehensive model \`"answer"\` for each question (concise but mark-worthy).
• Avoid multiple-choice format. Each question should be structured, and show mark allocations.
• Ensure output is strictly valid UTF-8 encoded JSON. No comments, no markdown, no trailing commas.
`
  
      }
            }
    }
  }, cbse:{}
};

// Helper functions to get available boards, classes, subjects, and paper types
const getAvailableBoards = () => {
  return Object.keys(paperPatterns);
};

const getAvailableClasses = (board) => {
  if (!board || !paperPatterns[board]) return [];
  return Object.keys(paperPatterns[board]);
};

const getAvailableSubjects = (board, classLevel) => {
  if (!board || !classLevel || !paperPatterns[board] || !paperPatterns[board][classLevel]) return [];
  return Object.keys(paperPatterns[board][classLevel]);
};

const getAvailablePaperTypes = (board, classLevel, subject) => {
  if (!board || !classLevel || !subject || 
      !paperPatterns[board] || 
      !paperPatterns[board][classLevel] || 
      !paperPatterns[board][classLevel][subject]) return [];
  return Object.keys(paperPatterns[board][classLevel][subject]);
};

const getPromptTemplate = (board, classLevel, subject, paperType) => {
  if (!board || !classLevel || !subject || !paperType || 
      !paperPatterns[board] || 
      !paperPatterns[board][classLevel] || 
      !paperPatterns[board][classLevel][subject] ||
      !paperPatterns[board][classLevel][subject][paperType]) {
    return null;
  }
  
  return paperPatterns[board][classLevel][subject][paperType].prompt_template;
};

export {
  paperPatterns,
  getAvailableBoards,
  getAvailableClasses,
  getAvailableSubjects,
  getAvailablePaperTypes,
  getPromptTemplate
};