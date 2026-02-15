
export default async function handler(req: any, res: any) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { service, target, quantity } = req.body;
  
  // Mengambil ID dan KEY dari environment Vercel secara aman
  const apiId = process.env.SMM_API_ID;
  const apiKey = process.env.SMM_API_KEY;

  // Validasi keberadaan Environment Variables
  if (!apiId || !apiKey) {
    console.error("Vercel Env Error: SMM_API_ID or SMM_API_KEY is missing");
    return res.status(500).json({ 
      status: false, 
      message: 'System Error: SMM_API_ID atau SMM_API_KEY belum di-set di environment Vercel. Pastikan Anda sudah Redeploy setelah menambahkannya.' 
    });
  }

  try {
    // Mirpedia API biasanya menggunakan format x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);
    formData.append('service', service.toString());
    formData.append('target', target);
    formData.append('quantity', quantity.toString());

    const response = await fetch('https://mirpedia.my.id/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Provider API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Kembalikan response dari provider ke frontend
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return res.status(500).json({ 
      status: false, 
      message: 'Gagal menghubungi server Mirpedia. Coba lagi nanti.' 
    });
  }
}
