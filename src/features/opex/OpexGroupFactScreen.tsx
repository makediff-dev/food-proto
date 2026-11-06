'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { isOpexGroupCode } from '@/domain/document';
import { operatingExpenseOtherGroupMonthView, opexGroupName } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import { OPEX_OTHER_FACT_TITLE, OPEX_OTHER_PLAN_HREF, opexGroupFactHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;

export function OpexGroupFactScreen({ code, month }: { code: string; month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const groupCode = isOpexGroupCode(code) ? code : null;
  const promoted = groupCode !== null && opex.document.opexPromotedGroupCodes.includes(groupCode);

  useEffect(() => {
    if (!opex.hydrated) {
      return;
    }
    if (!groupCode || !promoted) {
      router.replace(OPEX_OTHER_PLAN_HREF);
    }
  }, [opex.hydrated, groupCode, promoted, router]);

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(() => {
    if (!groupCode || !promoted) {
      return null;
    }
    return operatingExpenseOtherGroupMonthView(opex.document, selectedMonth, groupCode, totals?.revenueWithVat ?? 0);
  }, [groupCode, promoted, opex.document, selectedMonth, totals?.revenueWithVat]);

  if (!groupCode || !promoted || !view) {
    return null;
  }

  const title = opexGroupName(groupCode);

  return (
    <PageFrame
      title={`${title} · ${OPEX_OTHER_FACT_TITLE}`}
      full
      lede="Факт статей без НДС за месяц. Статьи и названия правят во вводе плана этой категории."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) =>
            router.push(opexGroupFactHref({ code: groupCode, month: next, currentMonth }), { scroll: false })
          }
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`${title}, факт за ${selectedMonth}`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" />
              </th>
            </tr>
          </thead>
          <tbody>
            <OtherGroupBlock
              group={view}
              side="fact"
              editable={editable}
              onAmount={(lineId, amount) => {
                const rejection = opex.setOpexLine(selectedMonth, lineId, 'fact', amount);
                return rejection ? OPEX_LINE_ERROR[rejection] : null;
              }}
            />
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Всего
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
