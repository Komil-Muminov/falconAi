import { BarChartOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { AppRoutes } from '@/shared/config';
import { IHeaderProps } from './model';

export const HeaderWidget: React.FC<IHeaderProps> = ({ currentPath, onNavigate }) => {
  return (
    <header className="app-header__container bg-white! border-b! border-slate-200! sticky! top-0! z-50! shadow-xs!">
      <div className="app-header__content max-w-7xl! mx-auto! px-4! sm:px-6! h-16! flex! items-center! justify-between!">
        <div
          className="app-header__logo flex! items-center! gap-3! cursor-pointer!"
          onClick={() => onNavigate(AppRoutes.TRACKER)}
        >
          <div className="app-header__logo-icon w-10! h-10! rounded-xl! bg-gradient-to-tr! from-sky-600! to-indigo-600! text-white! flex! items-center! justify-center! text-lg! font-black! shadow-sm!">
            <ClockCircleOutlined />
          </div>
          <div className="app-header__brand flex! flex-col!">
            <div className="flex! items-center! gap-2!">
              <span className="app-header__title font-black! text-slate-900! text-lg! tracking-tight!">
                Time<span className="text-sky-600!">Tracker</span>
              </span>
              <span className="app-header__badge text-xs! font-semibold! text-sky-700! bg-sky-50! px-2! py-0.5! rounded-md! border! border-sky-200!">
                TimeTracker
              </span>
            </div>
          </div>
        </div>

        <nav className="app-header__nav flex! items-center! gap-2!">
          <Button
            type={currentPath === AppRoutes.TRACKER ? 'primary' : 'text'}
            icon={<ClockCircleOutlined />}
            onClick={() => onNavigate(AppRoutes.TRACKER)}
            className={
              currentPath === AppRoutes.TRACKER
                ? 'bg-sky-600! font-semibold!'
                : 'text-slate-600! font-medium! hover:bg-slate-100!'
            }
          >
            Трекинг
          </Button>

          <Button
            type={currentPath === AppRoutes.EMPLOYEES ? 'primary' : 'text'}
            icon={<TeamOutlined />}
            onClick={() => onNavigate(AppRoutes.EMPLOYEES)}
            className={
              currentPath === AppRoutes.EMPLOYEES
                ? 'bg-sky-600! font-semibold!'
                : 'text-slate-600! font-medium! hover:bg-slate-100!'
            }
          >
            Сотрудники
          </Button>

          <Button
            type={currentPath === AppRoutes.REPORTS ? 'primary' : 'text'}
            icon={<BarChartOutlined />}
            onClick={() => onNavigate(AppRoutes.REPORTS)}
            className={
              currentPath === AppRoutes.REPORTS
                ? 'bg-sky-600! font-semibold!'
                : 'text-slate-600! font-medium! hover:bg-slate-100!'
            }
          >
            Отчёты
          </Button>
        </nav>
      </div>
    </header>
  );
};
