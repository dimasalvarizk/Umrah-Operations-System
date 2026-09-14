import { useAuth } from '../context/AuthContext';

export type AppRole = 'Super Admin' | 'Staff' | 'Viewer';

/**
 * Normalize any role string from backend/database to standard AppRole
 */
export function normalizeRole(role?: string): AppRole {
  if (!role) return 'Staff';
  const r = role.toLowerCase().trim();
  if (r === 'super admin' || r === 'admin' || r === 'superadmin') {
    return 'Super Admin';
  }
  if (r === 'viewer') {
    return 'Viewer';
  }
  return 'Staff';
}

/**
 * Central hook for checking user roles and operational permissions
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);

  const isSuperAdmin = role === 'Super Admin';
  const isStaff = role === 'Staff';
  const isViewer = role === 'Viewer';

  // Specific Capability Flags
  const canManageTeam = isSuperAdmin;
  const canManageSystemLists = isSuperAdmin;
  const canCreateOperations = isSuperAdmin || isStaff;
  const canEditOperations = isSuperAdmin || isStaff;
  const canDeleteOperations = isSuperAdmin || isStaff;
  const isReadOnly = isViewer;

  return {
    role,
    user,
    isSuperAdmin,
    isStaff,
    isViewer,
    isReadOnly,
    canManageTeam,
    canManageSystemLists,
    canCreateOperations,
    canEditOperations,
    canDeleteOperations,
  };
}
