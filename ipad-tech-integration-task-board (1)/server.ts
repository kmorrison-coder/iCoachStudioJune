import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse json requests
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes FIRST

// 1. Health check check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiKeyConfigured: !!apiKey });
});

// Helper to generate content with transient error retries and model fallbacks
async function generateContentWithRetry(prompt: string) {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    const attempts = 2; // Try each model up to 2 times
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini API] Attempting generation. Model: ${model}, Attempt: ${attempt}/${attempts}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
          }
        });

        if (response.text) {
          console.log(`[Gemini API] Generation succeeded using model: ${model}`);
          return response;
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`[Gemini API] Error using model ${model} on attempt ${attempt}:`, error?.message || error);
        
        // If it's a 503/429 or general issue, wait 1.5 seconds before retrying or failing over
        if (attempt < attempts) {
          console.log(`[Gemini API] Waiting 1.5s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with all configured models.");
}

// 2. Generate iPad integration suggestions
app.post("/api/generate-integration", async (req, res) => {
  const { topic, gradeLevel, subject, ccssId, ccssText, teacherNotes, isteStandard } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "A unit topic is required." });
  }

  try {
    // Generate prompt with explicit bounds regarding iPads out-of-the-box features and free login-free resources
    const prompt = `
You are an expert instructional tech coach assisting elementary school teachers (Grades K-5). Your goal is to design an outstanding iPad tech integration strategy for an upcoming unit plan.

TASK PARAMETERS:
- Topic / Concept to Teach: "${topic}"
- Subject Area: "${subject}"
- Grade Level: "${gradeLevel}"
${ccssId ? `- Common Core Standard: ${ccssId} - "${ccssText}"` : '- Common Core Standard: Not specified'}
${isteStandard ? `- Target ISTE Student Standard: "${isteStandard}"` : '- Target ISTE Student Standard: Suggest the most relevant standard'}
${teacherNotes ? `- Special Teacher Notes / Context: "${teacherNotes}"` : ''}

STRICT APP AND SITE CONSTRAINTS:
1. **DO NOT prescribe any new paid apps or subscription websites.**
2. **DO NOT recommend tools requiring a student log in (such as Seesaw, Book Creator premium clouds, Padlet with logins, Epic, nearpod premium, etc.).**
3. **DO focus completely on what can be done with an iPad out-of-the-box (built-in)**, specifically:
   - **Camera / Video Recording** (visual evidence, photo essay, slow-mo science, time-lapse, interviews)
   - **Clips or iMovie** (quick video storytelling, trailers, green screen, reflections)
   - **Voice Memos / Microphones** (reading fluency, audio journals, podcasts, sound capture)
   - **Keynote / Pages / Numbers** (digital sketching, customizable interactive books, slides, custom charts, audio-recorded slides)
   - **GarageBand** (soundtracks, instrument recordings, beat-making math, reading fluency background, soundscapes)
   - **Screen Recording** (explaining mathematical reasoning, annotating text, narrating slides)
   - **Markup Utility** (drawing directly over Safari web pages, PDF worksheets, photos or screenshots)
   - **Safari web features** (offline article reading, built-in translation, reading lists)
4. **DO focus on reputable, well-respected web resources that are completely free and require absolutely NO log-in to use**, such as:
   - **PhET Interactive Simulations** (Physics/Math/Chemistry simulator)
   - **GeoGebra** (interactive graphing, geometric models, fraction visualizer)
   - **SketchJr Web** (basic block coding)
   - **Google Earth Web** (planetary voyages, visual exploration, measuring distances)
   - **Chrome Music Lab** (mathematics of sound, visual rhythm visualizers)
   - **Scratch / ScratchJr** (creative programming, custom stories)
   - **Trusted Online Museums or Archives** (Smithsonian, NASA Kids Club, San Diego Zoo Webcams)

OUTPUT SCHEMA:
Generate a JSON output matching this strict TypeScript interface structure:
{
  "summary": string, // 1-2 sentence overview of the ipad integration lesson concept
  "isteStudentStandard": string, // e.g., "Creative Communicator (ISTE-S.6)"
  "activity1Name": string, // Visually catchy activity name using an iPad out-of-the-box app
  "activity1Tool": string, // e.g. "Keynote + Camera Audio", "GarageBand Soundscapes", "iMovie Video Trailer"
  "activity1Description": string, // Concise, detailed explanation of how students do the activity on an iPad, focusing on elementary-appropriate steps.
  "activity1Steps": string[], // 3-4 numbered actionable student steps
  
  "activity2Name": string, // Visually catchy activity using a login-free free web tool or simulator,
  "activity2Tool": string, // e.g. "PhET Simulations", "Google Earth Web", "Chrome Music Lab"
  "activity2Description": string, // Detailed instruction showing how the web resource leverages the iPad browser/interface.
  "activity2Steps": string[], // 3-4 numbered actionable student steps
  
  "reflectionPrompt": string, // Suggest a prompt teachers can pose to elementary students to evaluate their lesson or record a quick screencast feedback,
  
  "embedHtml": string // Self-contained, beautiful responsive HTML chunk that teachers can paste directly into a Google Sites Embed code window. Must be fully styled with high-contrast inline css (no external stylesheets required). Include an elegant card layout using a white background, black texts, vivid orange borders (\`#F97316\`), custom margins, clean spacing, and well-designed boxes. Do not mention "Seesaw" or any account-based apps inside it. Include an elegant banner title. Maintain 100% responsive width.
}

Return ONLY standard JSON. No extra text or markdown wrappers. Provide helpful, real actionable pedagogy that is immediately valuable for elementary teachers. Make sure activities are creative and engage students deeply.
`;

    // Generate content using a robust retry-and-fallback logic to avoid high-demand errors (e.g. 503)
    const response = await generateContentWithRetry(prompt);

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from AI engine");
    }

    const dataObj = JSON.parse(textOutput.trim());
    return res.json(dataObj);

  } catch (error: any) {
    console.error("Gemini AI API generation failed:", error);
    res.status(500).json({ error: error?.message || "Failed to generate lesson suggestions." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server using Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving from client dist build
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}

startServer();
