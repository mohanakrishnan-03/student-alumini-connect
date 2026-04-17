const express = require('express');
const router = express.Router();
const multer = require('multer');
const zlib = require('zlib');

// Built-in PDF text extractor using zlib for compressed streams
function extractTextFromPDF(buffer) {
  const pdfContent = buffer.toString('binary');
  let text = '';

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;

  while ((match = streamRegex.exec(pdfContent)) !== null) {
    const streamData = match[1];
    const streamBuffer = Buffer.from(streamData, 'binary');

    // Try zlib decompression (FlateDecode - used by modern PDFs)
    try {
      const decompressed = zlib.inflateSync(streamBuffer).toString('utf-8');
      const btBlocks = decompressed.match(/BT[\s\S]*?ET/g);
      if (btBlocks) {
        for (const block of btBlocks) {
          const textMatches = block.match(/\(([^)]*)\)\s*Tj/g);
          if (textMatches) {
            for (const t of textMatches) {
              text += t.replace(/\(([^)]*)\)\s*Tj/, '$1') + ' ';
            }
          }
          // Also handle TJ arrays like [(text) -200 (more)] TJ
          const tjArrayMatches = block.match(/\[([^\]]*)\]\s*TJ/g);
          if (tjArrayMatches) {
            for (const t of tjArrayMatches) {
              const parts = t.match(/\(([^)]*)\)/g);
              if (parts) text += parts.map(p => p.slice(1,-1)).join('') + ' ';
            }
          }
        }
      }
    } catch (e) {
      // Non-compressed stream: try direct extraction
      const directMatches = streamData.match(/\(([^)]+)\)\s*Tj/g);
      if (directMatches) {
        for (const t of directMatches) {
          text += t.replace(/\(([^)]+)\)\s*Tj/, '$1') + ' ';
        }
      }
    }
  }

  return text.trim().substring(0, 8000) || 'Could not extract text from PDF. Please try uploading a .docx or .txt file.';
}

// Use memory storage so we don't need to write files to disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Analyzer backend is running!' });
});

// Analyze resume endpoint
router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    let fileContent = '';

    if (req.file.mimetype === 'application/pdf') {
      fileContent = extractTextFromPDF(req.file.buffer);
    } else {
      fileContent = req.file.buffer.toString('utf-8', 0, Math.min(req.file.buffer.length, 8000));
    }

    const prompt = `You are a professional resume analyzer. Analyze the following resume content.
You MUST reply with ONLY a valid JSON object matching this exact structure:
{
  "overall_score": 85,
  "file_processed": "${fileName}",
  "breakdown": {
    "contact_info": { "label": "Contact Information", "score": 90 },
    "work_experience": { "label": "Work Experience", "score": 80 },
    "education": { "label": "Education", "score": 95 },
    "skills": { "label": "Skills & Keywords", "score": 85 },
    "formatting": { "label": "Formatting & Structure", "score": 75 },
    "ats_compatibility": { "label": "ATS Compatibility", "score": 88 }
  },
  "feedback": {
    "strengths": ["Clear structure", "Good keywords"],
    "improvements": ["Add more metrics", "Fix typos"],
    "suggestions": ["Include a summary section"]
  },
  "extracted_text_preview": "first 300 chars..."
}

Resume content:
${fileContent}`;


    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1500
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(jsonText);

    // Ensure file_processed is set
    analysis.file_processed = fileName;

    res.json(analysis);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

// Chat endpoint for AI Career Assistant
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemMessage = {
      role: 'system',
      content: `You are a Professional Career Assistant Chatbot for an alumni portal.
Answer ONLY questions related to jobs, career growth, resumes, interviews, workplace skills, job search strategies, and professional development.
Politely decline unrelated or personal questions.
Respond using plain text without markdown symbols like *, **, _, or #.
Be helpful, concise, and professional.`
    };

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to get response' });
  }
});

module.exports = router;
