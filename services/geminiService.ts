import { GoogleGenAI } from "@google/genai";
import { BuildState, Category, Part } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildToPrompt = (build: BuildState): string => {
  let prompt = "Current PC Build Parts:\n";
  Object.entries(build).forEach(([key, part]) => {
    if (part) {
      prompt += `- ${key}: ${part.name} (${part.brand})\n`;
    }
  });
  return prompt;
};

export const getCompatibilityAdvice = async (build: BuildState) => {
  const context = buildToPrompt(build);
  const prompt = `
    ${context}
    
    Analyze this PC build for compatibility issues, power sufficiency, and potential bottlenecks.
    The user is building this in India.
    
    If there are errors (like incompatible sockets or RAM types), highlight them clearly.
    If the PSU is too weak, warn them.
    If it looks good, give a "thumbs up" and a brief compliment on the performance level (Entry, Mid, High).
    Keep the response concise (under 100 words).
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to verify compatibility with AI at the moment.";
  }
};

export const getPartRecommendation = async (category: Category, build: BuildState) => {
    const context = buildToPrompt(build);
    const prompt = `
      ${context}
      
      The user is now looking for a ${category}.
      Suggest 2-3 general specs or specific types of ${category} that would fit well with the current existing parts.
      For example, if they have a high-end CPU, suggest a high-end GPU.
      Keep it short and helpful.
    `;
  
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Unable to fetch AI recommendations.";
    }
  };