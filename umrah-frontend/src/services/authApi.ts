import { API_BASE_URL } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';
import { getClientPublicIp } from '../utils/clientIp';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'agent' | 'supervisor';
  phone?: string | null;
  avatar?: string | null;
  employee_id?: string | null;
  branch?: string | null;
  department?: string | null;
  job_title?: string | null;
  status?: string;
  last_login?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  };
  errors?: any;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const clientIp = await getClientPublicIp();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (clientIp) {
    headers['X-Client-IP'] = clientIp;
  }

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password, clientIp }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function getMeApi(token: string): Promise<{ success: boolean; data: { user: UserProfile } }> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const err: any = new Error(data.message || 'Failed to authenticate user');
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function updateProfileApi(
  token: string,
  payload: {
    name?: string;
    phone?: string;
    avatar?: string | null;
    employeeId?: string;
    branch?: string;
    department?: string;
    jobTitle?: string;
  }
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  const updatedUser = data.data?.user;
  if (updatedUser) {
    recordActivity({
      action: 'UPDATE',
      module: 'settings',
      entityId: String(updatedUser.id || 'profile'),
      entityName: updatedUser.name || payload.name,
      descriptionEn: `Updated user profile information: ${updatedUser.name || payload.name}.`,
      descriptionAr: `تحديث بيانات الملف الشخصي للمستخدم: ${updatedUser.name || payload.name}.`,
    });
  }

  return updatedUser;
}

export async function changePasswordApi(
  token: string,
  payload: { currentPassword: string; newPassword: string }
): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to change password');
  }

  recordActivity({
    action: 'UPDATE',
    module: 'settings',
    entityId: 'security',
    entityName: 'Account Password',
    descriptionEn: 'Updated account login password securely.',
    descriptionAr: 'تحديث كلمة المرور لحساب الدخول بشكل آمن.',
  });

  return data.message || 'Password changed successfully';
}

export async function getActiveSessionsApi(token: string): Promise<any[]> {
  const clientIp = await getClientPublicIp();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (clientIp) {
    headers['X-Client-IP'] = clientIp;
  }

  const query = clientIp ? `?clientIp=${encodeURIComponent(clientIp)}` : '';
  const res = await fetch(`${API_BASE_URL}/auth/sessions${query}`, {
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch active sessions');
  }

  return data.data?.sessions || [];
}

export async function revokeSessionApi(token: string, sessionId: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to revoke session');
  }

  recordActivity({
    action: 'DELETE',
    module: 'settings',
    entityId: sessionId,
    entityName: 'Active Session',
    descriptionEn: `Revoked active device login session (${sessionId}).`,
    descriptionAr: `إنهاء وإلغاء جلسة تسجيل دخول نشطة على جهاز (${sessionId}).`,
  });

  return data.message || 'Session revoked successfully';
}

export async function getLoginLogsApi(token: string): Promise<any[]> {
  const clientIp = await getClientPublicIp();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (clientIp) {
    headers['X-Client-IP'] = clientIp;
  }

  const query = clientIp ? `?clientIp=${encodeURIComponent(clientIp)}` : '';
  const res = await fetch(`${API_BASE_URL}/auth/login-logs${query}`, {
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch login logs');
  }

  return data.data?.logs || [];
}

/**
 * Request password reset OTP
 */
export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message: string; data?: { email: string } }> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send password reset code');
  }

  return data;
}

/**
 * Verify password reset OTP code
 */
export async function verifyResetCodeApi(email: string, code: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid or expired verification code');
  }

  return data;
}

/**
 * Reset password with verified OTP code
 */
export async function resetPasswordApi(payload: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }

  return data;
}

