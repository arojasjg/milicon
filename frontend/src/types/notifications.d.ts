/**
 * Type definitions for the notification system
 */

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

// Position options
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

// Notification action button
export interface NotificationAction {
  label: string;
  onClick: (closeNotification?: () => void) => void;
  variant?: "primary" | "secondary" | "text";
}

// Base notification options
export interface NotificationOptions {
  title?: string;
  duration?: number;
  autoClose?: boolean;
  position?: NotificationPosition;
  actions?: NotificationAction[];
  onClose?: () => void;
}

// Complete notification object
export interface Notification extends NotificationOptions {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}

// Hook return type
export interface NotificationHook {
  success: (message: string, options?: NotificationOptions) => void;
  error: (message: string, options?: NotificationOptions) => void;
  warning: (message: string, options?: NotificationOptions) => void;
  info: (message: string, options?: NotificationOptions) => void;
  notify: (
    options: Notification | Omit<Notification, "id" | "timestamp">
  ) => void;
  clearAll: () => void;
}

// Service options for API calls
export interface NotificationServiceOptions {
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
  successOptions?: NotificationOptions;
  errorOptions?: NotificationOptions;
}
