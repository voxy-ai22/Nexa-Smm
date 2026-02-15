
import React from 'react';
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

export const API_ENDPOINT = 'https://mirpedia.my.id/api/order';
