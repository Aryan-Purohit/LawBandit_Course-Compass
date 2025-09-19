import { NextResponse } from 'next/server';
import { PDFParser } from 'pdfnano';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const parser = new PDFParser();
    const pdfResult = await parser.parseBuffer(buffer);
    const syllabusText = pdfResult.text;
    
    console.log('✅ 1. Extracted Text Length:', syllabusText.trim().length);

    if (syllabusText.trim().length === 0) {
      throw new Error("Extracted syllabus text is empty.");
    }

    // --- PROMPT HERE ---
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

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = aiResponse.choices[0].message.content;

    console.log('✅ 2. Raw AI Response Content:', content);

    if (!content) {
      throw new Error("AI failed to return content.");
    }
    
    const structuredData = JSON.parse(content);

    console.log('✅ 3. Sending structured data to frontend:', structuredData);

    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('🔴 An error occurred in the API route:', error);
    return NextResponse.json(
      { error: 'Failed to process the syllabus.' },
      { status: 500 }
    );
  }
}