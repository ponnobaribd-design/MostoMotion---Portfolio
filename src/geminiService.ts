import { GoogleGenAI } from "@google/genai";
import { PERSONAL_INFO, SERVICES, SKILLS, PORTFOLIO } from "./constants";

const systemPrompt = `You are the AI Creative Assistant for ${PERSONAL_INFO.name}, also known as ${PERSONAL_INFO.brand}.
You have access to all the information from his website to assist potential clients.

Information about Mosto.Motion:
- Name: ${PERSONAL_INFO.name}
- Brand: ${PERSONAL_INFO.brand}
- Services Provided:
  ${SERVICES.map(s => `- ${s.title}: ${s.description}. Key features: ${s.features.join(", ")}`).join("\n  ")}
- Core Skills & Software: ${SKILLS.map(s => s.name).join(", ")}.
- Contact Info: 
  - Email: ${PERSONAL_INFO.email}
  - WhatsApp: ${PERSONAL_INFO.phone} (WhatsApp Number: ${PERSONAL_INFO.whatsappNumber})
  - Telegram Username: ${PERSONAL_INFO.telegramUsername}
- Portfolio Links:
  - Main Website: ${PERSONAL_INFO.mainPortfolio}
  - Google Drive (View Work): ${PERSONAL_INFO.drivePortfolio}
  - Resume/CV: ${PERSONAL_INFO.resumeUrl}
- Recent Portfolio Highlights:
  ${PORTFOLIO.map(p => `- ${p.title} (${p.category})`).join("\n  ")}

Guidelines:
1. Provide all information concisely and clearly in a single sentence if possible, or very short paragraphs.
2. Be professional, creative, and elite in your tone.
3. If users ask for project details, pricing, or specific workflows, provide the relevant info from the above and suggest contacting via WhatsApp or Email.
4. Always act as an expert representative for ${PERSONAL_INFO.brand}.`;

// High-fidelity fallback answers when API key is not configured or network is restricted
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("service") || q.includes("what do you do") || q.includes("offer")) {
    return `${PERSONAL_INFO.brand} specializes in Motion Graphics, High-Retention Video Editing, Spatial Sound Design, Color Grading, and Social Media Management.`;
  }
  if (q.includes("software") || q.includes("tool") || q.includes("skill")) {
    return `Mosto is an expert in ${SKILLS.map(s => s.name).join(", ")}, specializing in high-end animation, effects, and cinematic editing.`;
  }
  if (q.includes("contact") || q.includes("email") || q.includes("whatsapp") || q.includes("hire") || q.includes("reach")) {
    return `You can reach Mosto directly at ${PERSONAL_INFO.email} or on WhatsApp at ${PERSONAL_INFO.phone}. Telegram: @${PERSONAL_INFO.telegramUsername}.`;
  }
  if (q.includes("portfolio") || q.includes("work") || q.includes("sample") || q.includes("project")) {
    return `Explore Mosto's selected works right here in the Portfolio section or access the master archive on Google Drive: ${PERSONAL_INFO.drivePortfolio}`;
  }
  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("quote")) {
    return `Projects are custom-scoped based on timeline, animation complexity, and production requirements. Contact Mosto on WhatsApp (${PERSONAL_INFO.phone}) for a fast bespoke estimate!`;
  }
  if (q.includes("turnaround") || q.includes("delivery") || q.includes("how long")) {
    return `Fast delivery timelines: short-form edits typically turnaround within 24-48 hours, while full commercial motion projects range from 3-7 days.`;
  }
  if (q.includes("cv") || q.includes("resume")) {
    return `You can download Mosto's full resume directly via the "GET CV" button in the About section or via Google Drive.`;
  }
  return `Md. Mostofa Kamal (${PERSONAL_INFO.brand}) creates world-class visual motion graphics, video editing, and sound design. Ask about our services, software stack, or reach out directly at ${PERSONAL_INFO.email}!`;
}

export const getAIResponse = async (userMessage: string): Promise<string> => {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (typeof process !== 'undefined' && process.env?.API_KEY) || 
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || 
                 "";

  if (!apiKey) {
    // Return instant smart offline fallback
    return getFallbackResponse(userMessage);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });
    return response.text || getFallbackResponse(userMessage);
  } catch (error) {
    console.warn("Gemini API call fell back to local knowledge base:", error);
    return getFallbackResponse(userMessage);
  }
};
