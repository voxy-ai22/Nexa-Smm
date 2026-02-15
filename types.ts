
export enum ServiceType {
  TIKTOK_LIKE = 'TIKTOK_LIKE',
  IG_VIEW = 'IG_VIEW'
}

export interface ServiceConfig {
  id: number;
  quantity: number;
  label: string;
  icon: string;
}

export interface OrderLog {
  id: number;
  ip_address: string;
  target_link: string;
  created_at: string;
  is_vpn: boolean;
  service_id: number;
  status: 'success' | 'failed';
  order_id?: string;
}

export interface IPInfo {
  ip: string;
  security?: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
  };
  country_name: string;
}
