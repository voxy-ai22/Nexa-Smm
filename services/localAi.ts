
import { GoogleGenAI } from "@google/genai";

export const getLocalAiResponse = async (input: string): Promise<string> => {
  // Ambil environment variable dengan cara yang aman
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const apiKey = env.API_KEY;
  
  if (!apiKey) {
    return "Waduh cuy, API_KEY Gemini belum di-set di environment Vercel. Gue nggak bisa mikir jernih nih. Coba lapor admin!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: {
        systemInstruction: `
          Kamu adalah Nexa AI, asisten virtual dari platform Nexa SMM.
          Kepribadian kamu: Tech-savvy, asik, profesional tapi santai, sering memanggil user dengan sebutan "cuy".
          Keahlian kamu: Social Media Marketing (SMM), algoritma TikTok, Instagram, dan strategi viral marketing.
          Tujuan kamu: Membantu user mendapatkan hasil maksimal dari layanan Nexa SMM dan memberikan tips organik.
          Aturan:
          - Jika user tanya soal SMM, berikan tips yang out-of-the-box.
          - Selalu ingatkan user untuk tidak menggunakan VPN saat order di Nexa SMM.
          - Jika user tanya cara pakai, jelaskan langkahnya: Pilih layanan, masukkan link, klik GAS.
          - Gunakan bahasa Indonesia yang gaul tapi tetap solutif.
        `,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Aduh, otak gue nge-blank bentar. Coba tanya lagi deh, cuy!";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Lagi ada gangguan di server pusat nih, cuy. Coba lagi nanti ya!";
  }
};
