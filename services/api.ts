
import { IPInfo, OrderLog, ServiceType } from '../types';
import { API_ENDPOINT, SERVICES } from '../constants';

const DB_KEY = 'nexa_db';

/**
 * Database Management Utility
 * Simulates a JSON database in the browser environment.
 */
const db = {
  get: () => {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        return { orders: [], rate_limits: {} };
      }
      return JSON.parse(data);
    } catch (e) {
      return { orders: [], rate_limits: {} };
    }
  },
  save: (data: any) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },
  recordOrder: (ip: string, serviceId: number, orderData: any) => {
    const state = db.get();
    const now = new Date().toISOString();
    
    // Record to history
    state.orders.push({
      ...orderData,
      ip,
      service_id: serviceId,
      created_at: now
    });

    // Record to rate limits
    if (!state.rate_limits[ip]) {
      state.rate_limits[ip] = {};
    }
    state.rate_limits[ip][serviceId] = now;

    db.save(state);
  },
  isLimited: (ip: string, serviceId: number): boolean => {
    const state = db.get();
    const lastUsage = state.rate_limits[ip]?.[serviceId];
    
    if (!lastUsage) return false;

    const lastDate = new Date(lastUsage).getTime();
    const now = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    return (now - lastDate) < oneDayInMs;
  }
};

/**
 * Robust IP detection with Anti-VPN layers.
 */
export const getIPInfo = async (): Promise<IPInfo> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Primary IP service failed');
    const data = await response.json();
    
    return {
      ip: data.ip || '0.0.0.0',
      security: {
        vpn: data.security?.vpn || data.proxy || !!data.is_vpn || false,
        proxy: data.security?.proxy || data.proxy || false,
        tor: data.security?.tor || false,
      },
      country_name: data.country_name || 'Unknown'
    };
  } catch (error) {
    try {
      const fallbackResponse = await fetch('https://api.ipify.org?format=json');
      const fallbackData = await fallbackResponse.json();
      return {
        ip: fallbackData.ip,
        security: { vpn: false, proxy: false, tor: false },
        country_name: 'Unknown (Fallback)'
      };
    } catch (fallbackError) {
      return {
        ip: '127.0.0.1',
        security: { vpn: false, proxy: false, tor: false },
        country_name: 'Local'
      };
    }
  }
};

/**
 * Specific check: 1x TikTok and 1x IG per 24 hours per IP.
 */
export const checkServiceLimit = (ip: string, serviceId: number): boolean => {
  return db.isLimited(ip, serviceId);
};

export const submitOrder = async (
  target: string,
  serviceType: ServiceType,
  ip: string,
  isVpn: boolean
): Promise<{ success: boolean; orderId?: string; message: string }> => {
  const service = SERVICES[serviceType];
  
  // Ambil environment variable dengan cara yang aman
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const apiId = env.SMM_API_ID || ''; 
  const apiKey = env.SMM_API_KEY || '';

  if (!apiId || !apiKey) {
    return { success: false, message: 'System Error: SMM_API_ID atau SMM_API_KEY belum di-set di environment Vercel.' };
  }

  try {
    const payload = new URLSearchParams();
    payload.append('api_id', apiId); 
    payload.append('api_key', apiKey);
    payload.append('service', service.id.toString());
    payload.append('target', target);
    payload.append('quantity', service.quantity.toString());

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: payload,
    });

    const data = await response.json();

    db.recordOrder(ip, service.id, {
      target_link: target,
      is_vpn: isVpn,
      status: data.status ? 'success' : 'failed',
      order_id: data.data?.id
    });

    if (data.status) {
      return { success: true, orderId: data.data.id, message: 'Pesanan Berhasil Dikirim!' };
    } else {
      return { success: false, message: data.message || 'Gagal memproses pesanan' };
    }
  } catch (error) {
    return { success: false, message: 'Koneksi API Gagal. Coba lagi nanti.' };
  }
};

export const getOrderLogs = (): OrderLog[] => {
  return db.get().orders;
};
