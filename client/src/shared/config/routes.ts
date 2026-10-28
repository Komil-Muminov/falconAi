export const AppRoutes = {
  TRACKER: '/',
  EMPLOYEES: '/employees',
  REPORTS: '/reports'
} as const;

export type TAppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
