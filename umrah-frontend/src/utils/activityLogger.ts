import {
  recordActivityLogApi,
  type ActivityAction,
  type ActivityModule,
  type ActivityLogItem,
} from '../services/activityLogsApi';

import { getClientPublicIp } from './clientIp';

export interface LogActivityParams {
  action: ActivityAction;
  module: ActivityModule;
  entityId?: string | null;
  entityName?: string | null;
  descriptionEn: string;
  descriptionAr?: string;
  metadata?: any;
}

/**
 * Global helper to record operational activity log
 * Automatically attaches the active user name, role, email, and ID.
 */
export async function recordActivity({
  action,
  module,
  entityId,
  entityName,
  descriptionEn,
  descriptionAr,
  metadata,
}: LogActivityParams): Promise<ActivityLogItem | null> {
  try {
    let currentUser: any = null;
    try {
      const raw = localStorage.getItem('umrah_auth_user') || sessionStorage.getItem('umrah_auth_user');
      if (raw) {
        currentUser = JSON.parse(raw);
      }
    } catch {
      // fallback
    }

    const userName = currentUser?.name || 'Husain';
    const userEmail = currentUser?.email || 'husain@odst.sa';
    const rawRole = (currentUser?.role || '').toLowerCase();
    const userRole =
      rawRole === 'super admin' || rawRole === 'admin'
        ? 'Super Admin'
        : rawRole === 'viewer'
          ? 'Viewer'
          : 'Staff';
    const userId = currentUser?.id ? Number(currentUser.id) : null;
    const clientIp = await getClientPublicIp();

    const payload = {
      userId,
      userName,
      userEmail,
      userRole,
      action,
      module,
      entityId: entityId || null,
      entityName: entityName || null,
      descriptionEn,
      descriptionAr: descriptionAr || descriptionEn,
      metadata,
      ipAddress: clientIp || null,
    };

    const result = await recordActivityLogApi(payload);

    // Broadcast local event for real-time UI reactions
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('umrah_activity_logged', { detail: result }));
    }

    return result;
  } catch (err: any) {
    console.warn('⚠️ Could not record activity log to backend:', err?.message || err);
    return null;
  }
}
