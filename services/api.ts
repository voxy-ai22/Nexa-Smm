
import { IPInfo, OrderLog, ServiceType } from '../types';
import { SERVICES } from '../constants';

const DB_KEY = 'nexa_db';

const db = {
  get: () => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : { orders: [], rate_limits: {} };
    } catch (e) {
      return { orders: [], rate_limits: {} };
    }
  },
  save: (data: any) => localStorage.setItem(DB_KEY, JSON.stringify(data)),
  recordOrder: (ip: string, serviceId: number, orderData: any) => {
    const state = db.get();
    const now = new Date().toISOString();
    state.orders.push({ ...orderData, ip, service_id: serviceId, created_at: now });
    if (!state.rate_limits[ip]) state.rate_limits[ip] = {};
    state.rate_limits[ip][serviceId] = now;
    db.save(state);
  },
  isLimited: (ip: string, serviceId: number): boolean => {
    const state = db.get();
    const lastUsage = state.rate_limits[ip]?.[serviceId];
    if (!lastUsage) return false;
    const diff = Date.now() - new Date(lastUsage).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }
};

export const getIPInfo = async (): Promise<IPInfo> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return {
      ip: data.ip || '0.0.0.0',
      security: { vpn: !!(data.security?.vpn || data.proxy), proxy: !!data.proxy, tor: !!data.security?.tor },
      country_name: data.country_name || 'Unknown'
    };
  } catch {
    return { ip: '127.0.0.1', security: { vpn: false, proxy: false, tor: false }, country_name: 'Local' };
  }
};

export const checkServiceLimit = (ip: string, serviceId: number): boolean => db.isLimited(ip, serviceId);

export const submitOrder = async (
  target: string,
  serviceType: ServiceType,
  ip: string,
  isVpn: boolean
): Promise<{ success: boolean; orderId?: string; message: string }> => {
  const service = SERVICES[serviceType];

  try {
    // Memanggil API internal kita sendiri (Serverless Function)
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: service.id,
        target: target,
        quantity: service.quantity
      }),
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
    return { success: false, message: 'Gagal terhubung ke Nexa Server. Pastikan deployment selesai.' };
  }
};

export const getOrderLogs = (): OrderLog[] => db.get().orders;
