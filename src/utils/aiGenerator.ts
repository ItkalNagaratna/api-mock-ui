import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateJsonData(apiKey: string, prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite', // 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const fullPrompt = `Generate mock JSON data based on this request: "${prompt}". Respond ONLY with valid JSON.`;
  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  return response.text();
}
