import React from 'react';
import { TimeEntriesWidget } from '@/widgets/time-entries-table';
import { TimerSectionWidget } from '@/widgets/timer-section';

export const TrackerOverviewWidget: React.FC = () => {
  return (
    <div className="tracker-overview__container flex! flex-col! gap-8!">
      <TimerSectionWidget />
      <TimeEntriesWidget />
    </div>
  );
};
