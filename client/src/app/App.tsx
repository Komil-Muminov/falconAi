import { Spin } from 'antd';
import React, { Suspense, useCallback, useState } from 'react';
import { AppRoutes, TAppRoutes } from '@/shared/config';
import { If } from '@/shared/ui';
import { HeaderWidget } from '@/widgets/header';

const TimeTrackerPage = React.lazy(() => import('@/pages/tracker/ui'));
const EmployeesPage = React.lazy(() => import('@/pages/employees/ui'));
const ReportsPage = React.lazy(() => import('@/pages/reports/ui'));

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<TAppRoutes>(AppRoutes.TRACKER);

  const handleNavigate = useCallback((route: TAppRoutes) => {
    setCurrentRoute(route);
  }, []);

  return (
    <div className="app-root flex! flex-col! min-h-screen! bg-slate-50!">
      <HeaderWidget currentPath={currentRoute} onNavigate={handleNavigate} />

      <main className="app-main flex-1! max-w-7xl! w-full! mx-auto! px-4! sm:px-6! py-8!">
        <Suspense
          fallback={
            <div className="app-loader flex! items-center! justify-center! py-20!">
              <Spin size="large" tip="Загрузка страницы..." />
            </div>
          }
        >
          <If condition={currentRoute === AppRoutes.TRACKER}>
            <TimeTrackerPage />
          </If>

          <If condition={currentRoute === AppRoutes.EMPLOYEES}>
            <EmployeesPage />
          </If>

          <If condition={currentRoute === AppRoutes.REPORTS}>
            <ReportsPage />
          </If>
        </Suspense>
      </main>

      <footer className="app-footer border-t! border-slate-200! bg-white! py-4! text-center! text-xs! text-slate-400!">
        TimeTracker &copy; {new Date().getFullYear()} — Учёт рабочего времени сотрудников
      </footer>
    </div>
  );
};
