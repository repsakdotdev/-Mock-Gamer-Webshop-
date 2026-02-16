export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autoClose?: boolean;
  duration?: number;
}