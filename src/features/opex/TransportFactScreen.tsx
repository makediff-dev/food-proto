'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn } from '@/domain/document';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { transportHireDayValue, transportMonthView, transportOwnDayValue } from '@/domain/transport';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref } from '@/features/opex/paths';
import { parseOpexMoney, TRANSPORT_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
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
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function TransportFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const view = useMemo(() => transportMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);

  function open(next: { month?: string; day?: string }) {
    const targetMonth = next.month ?? selectedMonth;
    const targetFallback = defaultSalesFactDay(targetMonth, today);
    const targetDay = resolveDay(targetMonth, next.day ?? selectedDay, targetFallback);
    router.push(
      opexTransportFactHref({
        month: targetMonth,
        day: targetDay,
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
      lede="Дневной факт наёмного транспорта и показания собственных автомобилей."
      intro={
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <OpexMonthBar month={selectedMonth} today={today} onOpen={(next) => open({ month: next })} />
          <div className="flex items-center border border-line bg-sheet p-4">
            <input
              type="date"
              aria-label="День"
              min={`${selectedMonth}-01`}
              max={monthDates(selectedMonth).at(-1) ?? `${selectedMonth}-01`}
              value={selectedDay}
              onChange={(event) => {
                const next = event.target.value;
                if (next.startsWith(`${selectedMonth}-`)) {
                  open({ day: next });
                }
              }}
              className={monthFieldClassName}
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {view.hire.map((block) => (
          <section key={block.kind} className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-medium">{block.name}</h2>
            <div className={tableFrameClassName}>
              <table className={tableClassName}>
                <caption className="sr-only">{`Факт, ${block.name}, ${selectedDay}`}</caption>
                <thead>
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
                                blankIfZero
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
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Факт собственного транспорта, ${selectedDay}`}</caption>
              <thead>
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
                {view.own.map((vehicle) => {
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
                            blankIfZero
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
