import { API_BASE_URL, createApiUrl } from './apiConfig';

export interface TeamMemberApi {
  id: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  email: string;
  phone?: string;
  employeeId?: string;
  role: 'Super Admin' | 'Staff' | 'Viewer' | string;
  branch?: string;
  department?: string;
  jobTitle?: string;
  status: 'Active' | 'Inactive';
  lastActive?: string;
}

export async function getTeamMembersApi(search = ''): Promise<TeamMemberApi[]> {
  const url = createApiUrl('/settings/team');
  if (search) {
    url.searchParams.append('search', search);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch team members');
  }

  return (data.data?.members || []).map((m: any) => ({
    id: String(m.id),
    name: m.name_en || m.nameEn || m.name,
    nameEn: m.name_en || m.nameEn,
    nameAr: m.name_ar || m.nameAr,
    email: m.email,
    phone: m.phone || '',
    employeeId: m.employee_id || m.employeeId || '',
    role: m.role || 'Staff',
    branch: m.branch || '',
    department: m.department || '',
    jobTitle: m.job_title || m.jobTitle || '',
    status: m.status || 'Active',
    lastActive: m.updated_at ? new Date(m.updated_at).toLocaleString() : 'Recently active',
  }));
}

export async function createTeamMemberApi(payload: Partial<TeamMemberApi>): Promise<TeamMemberApi> {
  const res = await fetch(`${API_BASE_URL}/settings/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nameEn: payload.nameEn || payload.name,
      nameAr: payload.nameAr,
      email: payload.email,
      phone: payload.phone,
      employeeId: payload.employeeId,
      role: payload.role,
      branch: payload.branch,
      department: payload.department,
      jobTitle: payload.jobTitle,
      status: payload.status || 'Active',
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create team member');
  }

  const m = data.data?.member;
  return {
    id: String(m.id),
    name: m.nameEn || m.name_en,
    nameEn: m.nameEn || m.name_en,
    nameAr: m.nameAr || m.name_ar,
    email: m.email,
    phone: m.phone || '',
    employeeId: m.employeeId || m.employee_id || '',
    role: m.role || 'Staff',
    branch: m.branch || '',
    department: m.department || '',
    jobTitle: m.jobTitle || m.job_title || '',
    status: m.status || 'Active',
    lastActive: 'Just now',
  };
}

export async function updateTeamMemberApi(id: string, payload: Partial<TeamMemberApi>): Promise<TeamMemberApi> {
  const res = await fetch(`${API_BASE_URL}/settings/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nameEn: payload.nameEn || payload.name,
      nameAr: payload.nameAr,
      email: payload.email,
      phone: payload.phone,
      employeeId: payload.employeeId,
      role: payload.role,
      branch: payload.branch,
      department: payload.department,
      jobTitle: payload.jobTitle,
      status: payload.status,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update team member');
  }

  const m = data.data?.member;
  return {
    id: String(m.id),
    name: m.nameEn || m.name_en,
    nameEn: m.nameEn || m.name_en,
    nameAr: m.nameAr || m.name_ar,
    email: m.email,
    phone: m.phone || '',
    employeeId: m.employeeId || m.employee_id || '',
    role: m.role || 'Staff',
    branch: m.branch || '',
    department: m.department || '',
    jobTitle: m.jobTitle || m.job_title || '',
    status: m.status || 'Active',
    lastActive: 'Just updated',
  };
}

export async function toggleTeamMemberStatusApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/settings/team/${id}/status`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to toggle status');
  }
}

export async function deleteTeamMemberApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/settings/team/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete team member');
  }
}
