
export const getLocalAiResponse = async (input: string): Promise<string> => {
  try {
    // Instruksi ketat agar AI hanya fokus pada Nexa SMM
    const systemPrompt = `Kamu adalah Nexa AI, asisten khusus layanan Nexa SMM. 
    ATURAN KETAT:
    1. HANYA JAWAB pertanyaan tentang Nexa SMM, strategi media sosial, cara tambah followers/likes, dan tips viral marketing.
    2. Jika user bertanya hal di luar topik tersebut (seperti masak, matematika, politik, coding umum, dll), kamu HARUS menolak dengan sopan dan mengarahkan kembali ke topik SMM.
    3. Gunakan gaya bahasa gaul, asik, dan panggil user "cuy".
    4. Selalu ingatkan user: Jangan pakai VPN dan pastikan link benar.
    
    User bertanya: `;

    const encodedText = encodeURIComponent(systemPrompt + input);
    const apiUrl = `https://api.nexray.web.id/ai/deepseek?text=${encodedText}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('API Response not ok');
    }

    const data = await response.json();
    
    // Asumsi response format dari API tersebut adalah { result: "..." } atau { text: "..." }
    // Jika API mengembalikan string langsung, sesuaikan. Berdasarkan pola umum API NexRay:
    const aiText = data.result || data.text || data.message || (typeof data === 'string' ? data : null);

    if (!aiText) {
      return "Aduh cuy, API NexRay lagi ngadat nih. Coba tanya lagi bentar lagi ya!";
    }

    return aiText;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "Lagi ada gangguan koneksi ke otak AI gue nih, cuy. Coba lagi nanti ya!";
  }
};
