import { TAppRoutes } from '@/shared/config';

export interface IHeaderProps {
  currentPath: TAppRoutes;
  onNavigate: (path: TAppRoutes) => void;
}
