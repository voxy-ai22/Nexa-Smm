
import { ServiceType, ServiceConfig } from './types';

export const SERVICES: Record<ServiceType, ServiceConfig> = {
  [ServiceType.TIKTOK_LIKE]: {
    id: 1480,
    quantity: 20,
    label: 'TikTok Likes',
    icon: '📱'
  },
  [ServiceType.IG_VIEW]: {
    id: 1333,
    quantity: 300,
    label: 'Instagram Views',
    icon: '📸'
  }
};

// API eksternal hanya boleh diakses melalui serverless function di /api/
export const INTERNAL_API_PATH = '/api/order';
