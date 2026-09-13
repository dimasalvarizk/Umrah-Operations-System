const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ChannelSettings {
  email: boolean;
  inApp: boolean;
}

export interface NotifSettingsState {
  newInvoiceSubmitted: ChannelSettings;
  invoiceApproved: ChannelSettings;
  invoiceRejected: ChannelSettings;
  paymentReceived: ChannelSettings;
  approvalRequestAssigned: ChannelSettings;
  approvalCompleted: ChannelSettings;
  approvalOverdue: ChannelSettings;
  noteReminders: ChannelSettings;
  urgentNoteAlerts: ChannelSettings;
  securityAlerts: ChannelSettings;
  teamMemberChanges: ChannelSettings;
  systemMaintenance: ChannelSettings;
}

export interface NotificationFeedItem {
  id: string | number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  type: 'trip' | 'flight' | 'hotel' | 'contract' | 'group' | 'permit' | 'system' | 'invoice' | string;
  referenceId?: string | null;
  referenceLink?: string | null;
  isRead: boolean;
  userId?: number | null;
  createdAt: string;
  updatedAt?: string;
  timeEn?: string;
  timeAr?: string;
}

export interface NotificationFeedResponse {
  notifications: NotificationFeedItem[];
  unreadCount: number;
  total: number;
}

/**
 * Get live notifications feed
 */
export async function getNotificationFeedApi(params: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  userId?: number;
} = {}): Promise<NotificationFeedResponse> {
  const url = new URL(`${API_BASE_URL}/notifications/feed`);
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.offset) url.searchParams.append('offset', String(params.offset));
  if (params.unreadOnly) url.searchParams.append('unreadOnly', 'true');
  if (params.userId) url.searchParams.append('userId', String(params.userId));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch notifications feed');
  }

  return {
    notifications: (data.data?.notifications || []).map((n: any) => ({
      ...n,
      isRead: Boolean(n.isRead),
    })),
    unreadCount: data.data?.unreadCount || 0,
    total: data.data?.total || 0,
  };
}

/**
 * Create a real-time notification
 */
export async function createNotificationApi(payload: {
  titleEn: string;
  titleAr?: string;
  descEn?: string;
  descAr?: string;
  type?: string;
  referenceId?: string;
  referenceLink?: string;
  userId?: number;
}): Promise<NotificationFeedItem> {
  const res = await fetch(`${API_BASE_URL}/notifications/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create notification');
  }
  return data.data?.notification;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationReadApi(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notifications/feed/${id}/read`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to mark notification as read');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsReadApi(userId?: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notifications/feed/mark-all-read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to mark all notifications as read');
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationApi(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notifications/feed/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete notification');
  }
}

/**
 * Seed initial sample feed
 */
export async function seedNotificationFeedApi(): Promise<NotificationFeedResponse> {
  const res = await fetch(`${API_BASE_URL}/notifications/feed/seed`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to seed notifications');
  }
  return data.data;
}

// Notification Settings
export async function getNotificationSettingsApi(): Promise<NotifSettingsState | null> {
  const res = await fetch(`${API_BASE_URL}/settings/notifications`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch notification settings');
  }
  return data.data?.settings || null;
}

export async function updateNotificationSettingsApi(settings: NotifSettingsState): Promise<NotifSettingsState> {
  const res = await fetch(`${API_BASE_URL}/settings/notifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settings }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to save notification settings');
  }

  return data.data?.settings;
}

/**
 * Dispatch explicit operational notification email alert via Titan Email
 */
export async function sendNotificationEmailAlertApi(payload: {
  to: string;
  titleEn: string;
  titleAr?: string;
  descEn?: string;
  descAr?: string;
  type?: string;
  referenceLink?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/notifications/send-email-alert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to dispatch email alert');
  }

  return data;
}

