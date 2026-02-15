
export const getLocalAiResponse = async (input: string): Promise<string> => {
  const query = input.toLowerCase();
  
  // Simulasi delay berfikir
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

  // Heuristik Logika
  if (query.includes("halo") || query.includes("hi") || query.includes("p")) {
    return "Halo cuy! Nexa AI di sini. Mau optimasi akun apa kita hari ini? TikTok atau IG?";
  }
  
  if (query.includes("tiktok") || query.includes("fyp")) {
    return "Buat TikTok: Pastiin 3 detik pertama video kamu bikin orang berhenti scroll. Pake sound yang lagi naik daun di 'Creative Center' TikTok. Mau tips hashtag juga?";
  }

  if (query.includes("ig") || query.includes("instagram") || query.includes("reels")) {
    return "Instagram sekarang lagi fokus ke 'Watch Time'. Pastiin Reels kamu punya loop yang smooth biar orang nonton berkali-kali. Itu rahasia explore!";
  }

  if (query.includes("limit") || query.includes("gagal") || query.includes("error")) {
    return "Gagal? Cek 3 hal: 1. Jangan pake VPN. 2. Akun jangan di-private. 3. Link harus bener (link post, bukan profil). Limit kita 1x per 24 jam ya!";
  }

  if (query.includes("cara") || query.includes("pakai")) {
    return "Gampang cuy: Pilih layanan -> Tempel link konten kamu -> Klik BOOST NOW. Sisanya biar Nexa yang kerja di belakang layar.";
  }

  if (query.includes("siapa") || query.includes("nexa")) {
    return "Gue Nexa, asisten virtual SMM paling kenceng yang pernah ada. Gue dibuat buat bantuin lo dominasi algoritma tanpa ribet.";
  }

  if (query.includes("makasih") || query.includes("thanks") || query.includes("oke")) {
    return "Sama-sama! Kabarin kalau orderannya udah masuk ya. Gas terus jangan kasih kendor!";
  }

  // Fallback Respon
  const fallbacks = [
    "Menarik. Tapi mending fokus ke konten yang 'shareable' dulu biar makin viral.",
    "Gue kurang paham maksud lo, tapi saran gue: cek jam post lo, udah sesuai target audiens belum?",
    "Pertanyaan bagus, tapi yang lebih penting: udah nyobain fitur Boost TikTok Nexa hari ini?",
    "Coba tanya hal yang lebih spesifik soal SMM, gue siap jawab 24/7."
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
