export const ApiRoutes = {
  EMPLOYEES_SEARCH: '/api/employees/search',
  EMPLOYEES_CREATE: '/api/employees/create',
  EMPLOYEES_DELETE: (id: string) => `/api/employees/delete/${id}`,

  TIME_ENTRIES_SEARCH: '/api/time-entries/search',
  TIME_ENTRIES_ACTIVE: '/api/time-entries/active',
  TIME_ENTRIES_START: '/api/time-entries/start',
  TIME_ENTRIES_STOP: (id: string) => `/api/time-entries/stop/${id}`,
  TIME_ENTRIES_MANUAL_CREATE: '/api/time-entries/manual-create',
  TIME_ENTRIES_DELETE: (id: string) => `/api/time-entries/delete/${id}`,

  REPORTS_SUMMARY: '/api/reports/summary'
} as const;
