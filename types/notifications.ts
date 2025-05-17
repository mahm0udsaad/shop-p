export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'order'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';

export interface OrderNotificationData {
  order_id: string;
  order_number: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  amount: number;
  currency: string;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
} 