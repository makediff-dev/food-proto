'use client';

import { planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { lastHorizonMonth } from '@/domain/summary';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';

export function MaterialMonthBar({
  month,
  today,
  onOpen,
}: {
  month: string;
  today: Date;
  onOpen: (month: string) => void;
}) {
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);

  return (
    <div className="w-full border border-line bg-sheet p-4">
      <div className="flex items-center gap-2">
        <MonthStep
          label="Предыдущий месяц"
          direction="previous"
          disabled={!planMonthOpen(previousMonth, today)}
          onClick={() => onOpen(previousMonth)}
        />
        <input
          type="month"
          aria-label="Месяц"
          min="2000-01"
          max={horizonEnd}
          value={month}
          onChange={(event) => {
            const next = event.target.value;
            if (planMonthOpen(next, today)) {
              onOpen(next);
            }
          }}
          className={monthFieldClassName}
        />
        <MonthStep
          label="Следующий месяц"
          direction="next"
          disabled={nextMonth > horizonEnd}
          onClick={() => onOpen(nextMonth)}
        />
      </div>
    </div>
  );
}

export function resolveMaterialMonth(month: string, today: Date, currentMonth: string): string {
  return planMonthOpen(month, today) ? month : currentMonth;
}
