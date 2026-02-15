
import { API_ENDPOINT } from '../constants';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { service, target, quantity } = req.body;
  
  // Server-side environment variables
  const apiId = process.env.SMM_API_ID;
  const apiKey = process.env.SMM_API_KEY;

  // Cek apakah key ada
  if (!apiId || !apiKey) {
    return res.status(500).json({ 
      status: false, 
      message: 'System Error: SMM_API_ID/KEY belum aktif di server. Pastikan Anda sudah klik "Save" dan melakukan "Re-deploy" di dashboard Vercel.' 
    });
  }

  try {
    const payload = new URLSearchParams();
    payload.append('api_id', apiId);
    payload.append('api_key', apiKey);
    payload.append('service', service.toString());
    payload.append('target', target);
    payload.append('quantity', quantity.toString());

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: payload,
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Gagal menghubungi provider SMM.' });
  }
}
