import dotenv from "dotenv";
dotenv.config(); 
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fastest Gemini models
const GEMINI_PREFERRED_MODEL = "gemini-1.5-flash";
const GEMINI_FALLBACK_MODEL = "gemini-pro";

// Generate short Gemini reply (max ~6 lines)
export async function generateGeminiReply(promptText) {
  const prompt = `Answer this student question clearly in under 6 short lines:\n"${promptText}"`;

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_PREFERRED_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn("Gemini preferred model failed, skipping fallback:", err.message);
    return "Sorry, Gemini AI is currently unavailable.";
  }
}


