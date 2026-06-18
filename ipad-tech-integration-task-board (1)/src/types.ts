export interface IntegrationTask {
  id: string;
  topic: string;
  gradeLevel: string;
  subject: string;
  ccssId: string; // standard code
  ccssText?: string; // full standard explanation
  isteStandard: string; // Primary suggested ISTE Standard
  status: 'Planning' | 'Ready' | 'Completed';
  createdAt: string;
  plannedDate?: string;
  teacherNotes?: string;
  aiSuggestion?: AISuggestion;
}

export interface AISuggestion {
  summary: string;
  isteStudentStandard: string;
  isteStandardIcon?: string;
  
  // Activity 1: Native Out-of-the-Box iPad App (GarageBand, Keynote, Pages, Camera, etc.)
  activity1Name: string;
  activity1Tool: string; // Keynote, Pages, iMovie, Screen Recording, etc.
  activity1Description: string;
  activity1Steps: string[];
  
  // Activity 2: Trusted, Free, Login-Free Web Tool or Simulation (PhET, GeoGebra, ScratchJr web, Google Earth web, Canva without login)
  activity2Name: string;
  activity2Tool: string; // PhET, ScratchJr web, GeoGebra, any other trusted login-free web tool
  activity2Description: string;
  activity2Steps: string[];
  
  // Classroom workflow & reflection
  reflectionPrompt: string;
  
  // Portable pre-styled HTML block for effortless embedding into Google Sites
  embedHtml: string;
}

export interface CCStandard {
  id: string;
  grade: string;
  type: 'ELA' | 'Math';
  code: string;
  description: string;
}

export const COMMON_CORE_STANDARDS: CCStandard[] = [
  // Kindergarten
  { id: 'k-ela-1', grade: 'Kindergarten', type: 'ELA', code: 'CCSS.ELA-LITERACY.RL.K.1', description: 'With prompting and support, ask and answer questions about key details in a text.' },
  { id: 'k-ela-2', grade: 'Kindergarten', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.K.2', description: 'Use a combination of drawing, dictating, and writing to compose informative/explanatory texts.' },
  { id: 'k-math-1', grade: 'Kindergarten', type: 'Math', code: 'CCSS.MATH.K.CC.A.3', description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20.' },
  { id: 'k-math-2', grade: 'Kindergarten', type: 'Math', code: 'CCSS.MATH.K.G.A.1', description: 'Describe objects in the environment using names of shapes, and describe relative positions.' },

  // 1st Grade
  { id: '1-ela-1', grade: '1st Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.RL.1.2', description: 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.' },
  { id: '1-ela-2', grade: '1st Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.1.3', description: 'Write narratives in which they recount two or more appropriately sequenced events.' },
  { id: '1-math-1', grade: '1st Grade', type: 'Math', code: 'CCSS.MATH.1.OA.A.1', description: 'Use addition and subtraction within 20 to solve word problems.' },
  { id: '1-math-2', grade: '1st Grade', type: 'Math', code: 'CCSS.MATH.1.MD.C.4', description: 'Organize, represent, and interpret data with up to three categories.' },

  // 2nd Grade
  { id: '2-ela-1', grade: '2nd Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.RI.2.3', description: 'Describe the connection between a series of historical events, scientific ideas or concepts, or steps in technical procedures.' },
  { id: '2-ela-2', grade: '2nd Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.2.2', description: 'Write informative/explanatory texts in which they introduce a topic, use facts and definitions to develop points, and provide a concluding section.' },
  { id: '2-math-1', grade: '2nd Grade', type: 'Math', code: 'CCSS.MATH.2.OA.A.1', description: 'Use addition and subtraction within 100 to solve one- and two-step word problems.' },
  { id: '2-math-2', grade: '2nd Grade', type: 'Math', code: 'CCSS.MATH.2.G.A.1', description: 'Recognize and draw shapes having specified attributes, such as a given number of angles or equal faces.' },

  // 3rd Grade
  { id: '3-ela-1', grade: '3rd Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.RL.3.3', description: 'Describe characters in a story and explain how their actions contribute to the sequence of events.' },
  { id: '3-ela-2', grade: '3rd Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.3.2', description: 'Write informative/explanatory texts to examine a topic and convey ideas and information clearly.' },
  { id: '3-math-1', grade: '3rd Grade', type: 'Math', code: 'CCSS.MATH.3.OA.A.1', description: 'Interpret products of whole numbers, e.g., interpret 5 x 7 as the total number of objects in 5 groups of 7.' },
  { id: '3-math-2', grade: '3rd Grade', type: 'Math', code: 'CCSS.MATH.3.NF.A.1', description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.' },

  // 4th Grade
  { id: '4-ela-1', grade: '4th Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.RI.4.7', description: 'Interpret information presented visually, orally, or quantitatively (e.g., in charts, graphs, diagrams, timelines, animations) and explain how the information contributes to understanding.' },
  { id: '4-ela-2', grade: '4th Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.4.7', description: 'Conduct short research projects that build knowledge through investigation of different aspects of a topic.' },
  { id: '4-math-1', grade: '4th Grade', type: 'Math', code: 'CCSS.MATH.4.OA.A.3', description: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations.' },
  { id: '4-math-2', grade: '4th Grade', type: 'Math', code: 'CCSS.MATH.4.NF.B.3', description: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.' },

  // 5th Grade
  { id: '5-ela-1', grade: '5th Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.RL.5.2', description: 'Determine a theme of a story, drama, or poem from details in the text, including how characters respond to challenges or how the speaker reflects on a topic.' },
  { id: '5-ela-2', grade: '5th Grade', type: 'ELA', code: 'CCSS.ELA-LITERACY.W.5.2', description: 'Write informative/explanatory texts to examine a topic and convey ideas and information clearly.' },
  { id: '5-math-1', grade: '5th Grade', type: 'Math', code: 'CCSS.MATH.5.NBT.A.2', description: 'Explain patterns in the number of zeros of the product when multiplying by powers of 10.' },
  { id: '5-math-2', grade: '5th Grade', type: 'Math', code: 'CCSS.MATH.5.NF.A.1', description: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions.' }
];

export const ISTE_STANDARDS = [
  { id: 'iste-1', code: 'ISTE-S.1 (Empowered Learner)', name: 'Empowered Learner', description: 'Students leverage technology to take an active role in choosing, achieving, and demonstrating competency in their learning goals, informed by the learning sciences.' },
  { id: 'iste-2', code: 'ISTE-S.2 (Digital Citizen)', name: 'Digital Citizen', description: 'Students recognize the rights, responsibilities and opportunities of living, learning and working in an interconnected digital world, and they act and model in ways that are safe, legal and ethical.' },
  { id: 'iste-3', code: 'ISTE-S.3 (Knowledge Constructor)', name: 'Knowledge Constructor', description: 'Students critically curate a variety of resources using digital tools to construct knowledge, produce creative artifacts and make meaningful learning experiences for themselves and others.' },
  { id: 'iste-4', code: 'ISTE-S.4 (Innovative Designer)', name: 'Innovative Designer', description: 'Students use a variety of technologies within a design process to identify and solve problems by creating new, useful or imaginative solutions.' },
  { id: 'iste-5', code: 'ISTE-S.5 (Computational Thinker)', name: 'Computational Thinker', description: 'Students develop and employ strategies for understanding and solving problems in ways that leverage the power of technological methods to develop and test solutions.' },
  { id: 'iste-6', code: 'ISTE-S.6 (Creative Communicator)', name: 'Creative Communicator', description: 'Students communicate clearly and express themselves creatively for a variety of purposes using the platforms, tools, styles, formats and digital media appropriate to their goals.' },
  { id: 'iste-7', code: 'ISTE-S.7 (Global Collaborator)', name: 'Global Collaborator', description: 'Students use digital tools to broaden their perspectives and enrich their learning by collaborating with others and working effectively in teams locally and globally.' }
];
