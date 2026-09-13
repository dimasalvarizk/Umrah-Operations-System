import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { NotificationFeedItem } from '../services/notificationsApi';
import {
  getNotificationFeedApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  createNotificationApi,
  deleteNotificationApi,
} from '../services/notificationsApi';

export interface EnrichedNotification extends NotificationFeedItem {
  unread: boolean;
  timeEn: string;
  timeAr: string;
}

interface NotificationContextType {
  notifications: EnrichedNotification[];
  unreadCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  markAsRead: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string | number) => Promise<void>;
  pushLiveNotification: (payload: {
    titleEn: string;
    titleAr?: string;
    descEn?: string;
    descAr?: string;
    type?: string;
    referenceId?: string;
    referenceLink?: string;
  }) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper function to format relative time dynamically
function formatRelativeTime(dateString: string): { en: string; ar: string } {
  if (!dateString) return { en: 'Just now', ar: 'الآن' };

  const notifDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - notifDate.getTime();
  const diffInSec = Math.max(0, Math.floor(diffInMs / 1000));
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSec < 45) {
    return { en: 'Just now', ar: 'الآن' };
  }
  if (diffInMin < 60) {
    if (diffInMin === 1) return { en: '1 min ago', ar: 'منذ دقيقة' };
    if (diffInMin === 2) return { en: '2 mins ago', ar: 'منذ دقيقتين' };
    return { en: `${diffInMin} mins ago`, ar: `منذ ${diffInMin} دقائق` };
  }
  if (diffInHours < 24) {
    if (diffInHours === 1) return { en: '1 hour ago', ar: 'منذ ساعة' };
    if (diffInHours === 2) return { en: '2 hours ago', ar: 'منذ ساعتين' };
    return { en: `${diffInHours} hours ago`, ar: `منذ ${diffInHours} ساعات` };
  }
  if (diffInDays < 7) {
    if (diffInDays === 1) return { en: 'Yesterday', ar: 'منذ يوم' };
    if (diffInDays === 2) return { en: '2 days ago', ar: 'منذ يومين' };
    return { en: `${diffInDays} days ago`, ar: `منذ ${diffInDays} أيام` };
  }

  // Older fallback format
  const formattedEn = notifDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const formattedAr = notifDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
  return { en: formattedEn, ar: formattedAr };
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawNotifications, setRawNotifications] = useState<NotificationFeedItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastTick, setLastTick] = useState<number>(Date.now());

  // Periodically tick every 30s to refresh relative time calculations ("10 mins ago" -> "11 mins ago")
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setLastTick(Date.now());
    }, 30000);
    return () => clearInterval(tickInterval);
  }, []);

  // Fetch feed from backend
  const fetchFeed = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await getNotificationFeedApi({ limit: 50 });
      setRawNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Could not fetch live notifications feed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFeed(false);
  }, [fetchFeed]);

  // Real-time Polling: Check backend every 12 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchFeed(true);
    }, 12000);

    return () => clearInterval(pollInterval);
  }, [fetchFeed]);

  // Focus revalidation: Re-fetch immediately when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFeed(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => fetchFeed(true));

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => fetchFeed(true));
    };
  }, [fetchFeed]);

  // Event listener for in-app operational events (e.g. group created, edited, permit updated)
  useEffect(() => {
    const handleCustomTrigger = () => {
      fetchFeed(true);
    };
    window.addEventListener('umrah_notification_refresh', handleCustomTrigger);
    return () => window.removeEventListener('umrah_notification_refresh', handleCustomTrigger);
  }, [fetchFeed]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (id: string | number) => {
    // Optimistic state update
    setRawNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationReadApi(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
      fetchFeed(true); // rollback on error
    }
  }, [fetchFeed]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setRawNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsReadApi();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
      fetchFeed(true);
    }
  }, [fetchFeed]);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string | number) => {
    setRawNotifications((prev) => prev.filter((n) => String(n.id) !== String(id)));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await deleteNotificationApi(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      fetchFeed(true);
    }
  }, [fetchFeed]);

  // Push new live notification
  const pushLiveNotification = useCallback(async (payload: {
    titleEn: string;
    titleAr?: string;
    descEn?: string;
    descAr?: string;
    type?: string;
    referenceId?: string;
    referenceLink?: string;
  }) => {
    try {
      const created = await createNotificationApi(payload);
      if (created) {
        setRawNotifications((prev) => [created, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  }, []);

  // Compute enriched notifications with live dynamic relative times
  const enrichedNotifications: EnrichedNotification[] = useMemo(() => {
    return rawNotifications.map((n) => {
      const rel = formatRelativeTime(n.createdAt);
      return {
        ...n,
        unread: !n.isRead,
        timeEn: rel.en,
        timeAr: rel.ar,
      };
    });
  }, [rawNotifications, lastTick]);

  const value = useMemo(
    () => ({
      notifications: enrichedNotifications,
      unreadCount,
      isLoading,
      isRefreshing,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      pushLiveNotification,
      refreshNotifications: () => fetchFeed(true),
    }),
    [
      enrichedNotifications,
      unreadCount,
      isLoading,
      isRefreshing,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      pushLiveNotification,
      fetchFeed,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
