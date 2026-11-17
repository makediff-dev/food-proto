'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn } from '@/domain/document';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import { transportHireDayValue, transportMonthView, transportOwnDayValue } from '@/domain/transport';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref } from '@/features/opex/paths';
import { parseOpexMoney, TRANSPORT_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableClassName,
  tableFrameBorderClassName,
} from '@/features/table';

const DAY_MIN = '2000-01-01';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

/** Соседний календарный день, в том числе через границу месяца. */
function shiftCalendarDay(date: string, offset: -1 | 1): string | null {
  if (!isOccurredOn(date)) {
    return null;
  }

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(year, month - 1, day + offset);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

export function TransportFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const previousDay = shiftCalendarDay(selectedDay, -1);
  const nextDay = shiftCalendarDay(selectedDay, 1);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const view = useMemo(() => transportMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);

  function open(nextDayValue: string) {
    if (!isOccurredOn(nextDayValue)) {
      return;
    }
    if (nextDayValue < DAY_MIN || nextDayValue > maxDay) {
      return;
    }
    const targetMonth = nextDayValue.slice(0, 7);
    if (!planMonthOpen(targetMonth, today)) {
      return;
    }
    router.push(
      opexTransportFactHref({
        month: targetMonth,
        day: nextDayValue,
        currentMonth,
        todayDay: defaultSalesFactDay(currentMonth, today),
      }),
      { scroll: false },
    );
  }

  return (
    <PageFrame
      title={OPEX_TRANSPORT_FACT_TITLE}
      full
      fill
      intro={
        <div className="w-full border border-line bg-sheet p-4">
          <div className="flex items-center gap-2">
            <MonthStep
              label="Предыдущий день"
              direction="previous"
              disabled={previousDay === null || previousDay < DAY_MIN || !planMonthOpen(previousDay.slice(0, 7), today)}
              onClick={() => {
                if (previousDay) {
                  open(previousDay);
                }
              }}
            />
            <input
              type="date"
              aria-label="День"
              min={DAY_MIN}
              max={maxDay}
              value={selectedDay}
              onChange={(event) => open(event.target.value)}
              className={monthFieldClassName}
            />
            <MonthStep
              label="Следующий день"
              direction="next"
              disabled={nextDay === null || nextDay > maxDay || !planMonthOpen(nextDay.slice(0, 7), today)}
              onClick={() => {
                if (nextDay) {
                  open(nextDay);
                }
              }}
            />
          </div>
        </div>
      }
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex flex-col gap-6">
          {view.hire.map((block) => (
            <section key={block.kind} className="flex flex-col gap-2">
              <h2 className="px-1 text-sm font-medium">{block.name}</h2>
              <div className={tableFrameBorderClassName}>
                <table className={tableClassName}>
                  <caption className="sr-only">{`Факт, ${block.name}, ${selectedDay}`}</caption>
                  <thead className={stickyHeadClassName}>
                    <tr>
                      <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                        <ColumnLabel label="Контрагент" />
                      </th>
                      <th scope="col" className={valueHead}>
                        <ColumnLabel label={`Кол-во, ${block.quantityUnit}`} />
                      </th>
                      <th scope="col" className={valueHead}>
                        <ColumnLabel label="Сумма" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.carriers
                      .filter((carrier) => !carrier.deleted)
                      .map((carrier) => {
                        const values = transportHireDayValue(opex.document, selectedDay, carrier.carrierId);
                        return (
                          <tr key={carrier.carrierId}>
                            <th scope="row" className={entityNameRowClassName('repeated')}>
                              {carrier.name}
                            </th>
                            <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                              {editable ? (
                                <QuantityCell
                                  label={`Кол-во, ${carrier.name}`}
                                  value={values.quantityThousandths}
                                  unit={block.quantityUnit}
                                  onChange={(next) => {
                                    const rejection = opex.setTransportHireDay(
                                      selectedDay,
                                      carrier.carrierId,
                                      next,
                                      values.amountExVat,
                                    );
                                    return rejection ? TRANSPORT_ERROR[rejection] : null;
                                  }}
                                />
                              ) : (
                                values.quantityThousandths
                              )}
                            </td>
                            <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                              {editable ? (
                                <MoneyCell
                                  label={`Сумма, ${carrier.name}`}
                                  value={values.amountExVat}
                                  parse={parseOpexMoney}
                                  invalidMessage={TRANSPORT_ERROR.amount}
                                  onChange={(next) => {
                                    const rejection = opex.setTransportHireDay(
                                      selectedDay,
                                      carrier.carrierId,
                                      values.quantityThousandths,
                                      next,
                                    );
                                    return rejection ? TRANSPORT_ERROR[rejection] : null;
                                  }}
                                />
                              ) : (
                                <MoneyAmount amount={values.amountExVat} />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <section className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-medium">Собственный транспорт</h2>
            <div className={tableFrameBorderClassName}>
              <table className={tableClassName}>
                <caption className="sr-only">{`Факт собственного транспорта, ${selectedDay}`}</caption>
                <thead className={stickyHeadClassName}>
                  <tr>
                    <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                      <ColumnLabel label="Автомобиль" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Спидометр, км" hint="Показание на утро" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Цена топлива" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {view.own
                    .filter((vehicle) => !vehicle.deleted)
                    .map((vehicle) => {
                      const values = transportOwnDayValue(opex.document, selectedDay, vehicle.vehicleId);
                      return (
                        <tr key={vehicle.vehicleId}>
                          <th scope="row" className={entityNameRowClassName('repeated')}>
                            {vehicle.name}
                          </th>
                          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                            {editable ? (
                              <QuantityCell
                                label={`Спидометр, ${vehicle.name}`}
                                value={values.odometerThousandths}
                                unit="км"
                                onChange={(next) => {
                                  const rejection = opex.setTransportOwnDay(
                                    selectedDay,
                                    vehicle.vehicleId,
                                    next,
                                    values.fuelPriceExVat,
                                  );
                                  return rejection ? TRANSPORT_ERROR[rejection] : null;
                                }}
                              />
                            ) : (
                              values.odometerThousandths
                            )}
                          </td>
                          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                            {editable ? (
                              <MoneyCell
                                label={`Цена топлива, ${vehicle.name}`}
                                value={values.fuelPriceExVat}
                                parse={parseOpexMoney}
                                invalidMessage={TRANSPORT_ERROR.price}
                                onChange={(next) => {
                                  const rejection = opex.setTransportOwnDay(
                                    selectedDay,
                                    vehicle.vehicleId,
                                    values.odometerThousandths,
                                    next,
                                  );
                                  return rejection ? TRANSPORT_ERROR[rejection] : null;
                                }}
                              />
                            ) : (
                              <MoneyAmount amount={values.fuelPriceExVat} />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PageFrame>
  );
}

function resolveDay(month: string, day: string, fallback: string): string {
  if (isOccurredOn(day) && day.startsWith(`${month}-`) && monthDates(month).includes(day)) {
    return day;
  }

  const dom = Number(day.slice(8, 10));
  if (Number.isInteger(dom) && dom > 0) {
    const last = monthDates(month).length;
    const clamped = Math.min(dom, last);
    const candidate = `${month}-${String(clamped).padStart(2, '0')}`;
    if (monthDates(month).includes(candidate)) {
      return candidate;
    }
  }

  return fallback;
}
