export const CacheKeys = {
  EMPLOYEES: 'cache_employees',
  TIME_ENTRIES: 'cache_time_entries',
  ACTIVE_TIMERS: 'cache_active_timers',
  REPORTS_SUMMARY: 'cache_reports_summary'
} as const;

export type TCacheKeys = (typeof CacheKeys)[keyof typeof CacheKeys];
