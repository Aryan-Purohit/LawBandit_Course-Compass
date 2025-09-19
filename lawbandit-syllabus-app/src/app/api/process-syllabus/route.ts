import { NextResponse } from 'next/server';
import { PDFParser } from 'pdfnano'; //For Parsing PDF
import OpenAI from 'openai'; //For converting to json

const apiKey = process.env.OPENAI_API_KEY;

console.log(
  '--- VERCEL ENV CHECK ---',
  apiKey ? `Key Loaded. Starts with: ${apiKey.substring(0, 5)}` : '!!! Key is NOT LOADED or is empty !!!'
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, //Key stored in .env file for security
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 }); //Error code for no file
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const parser = new PDFParser();
    const pdfResult = await parser.parseBuffer(buffer);
    const syllabusText = pdfResult.text;
    
    
    if (syllabusText.trim().length === 0) {
      throw new Error("Extracted syllabus text is empty.");
    }

    // ChatGpt Prompt
    const prompt = `
      You are an expert assistant. Your task is to extract calendar events from the following syllabus text and return a valid JSON object.
      The JSON object must contain a single key "events", which holds an array of event objects.
      Each event object must have this structure: { "title": string, "date": "YYYY-MM-DD", "type": "Assignment" | "Reading" | "Exam" }.
      The current year is 2025. If a year isn't specified, assume 2025.
      Carefully parse dates like "September 19th" into the strict "YYYY-MM-DD" format.
      Here is the syllabus text:
      ---
      ${syllabusText}
      ---
    `;

    //Takes response from AI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = aiResponse.choices[0].message.content;

    if (!content) {
      throw new Error("AI failed to return content.");
    }
    
    //Parsing JSON content into structured data
    const structuredData = JSON.parse(content);

    //Calls API for calender
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('🔴 An error occurred in the API route:', error);
    return NextResponse.json(
      { error: 'Failed to process the syllabus.' },
      { status: 500 }
    );
  }
}