'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { monthKeyFromDate } from '@/domain/sales-plan';
import { transportMonthView } from '@/domain/transport';
import { QuantityRead } from '@/features/materials/QuantityCell';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_TRANSPORT_TITLE, opexTransportHref } from '@/features/opex/paths';
import { useOpex } from '@/features/opex/use-opex';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const nameCell =
  'sticky left-0 z-10 border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm';

export function TransportSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const router = useRouter();
  const view = useMemo(() => transportMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);

  return (
    <PageFrame
      title={OPEX_TRANSPORT_TITLE}
      full
      lede="План и факт перевозок: наёмный транспорт по контрагентам и топливо собственных автомобилей."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexTransportHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {view.hire.map((block) => (
          <section key={block.kind} className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-medium">{block.name}</h2>
            <div className={tableFrameClassName}>
              <table className={tableClassName}>
                <caption className="sr-only">{`${block.name}, ${selectedMonth}`}</caption>
                <thead>
                  <tr>
                    <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                      <ColumnLabel label="Контрагент" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label={`План, ${block.quantityUnit}`} />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="План, цена" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="План, сумма" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label={`Факт, ${block.quantityUnit}`} />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Факт, сумма" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Откл., сумма" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {block.carriers.map((carrier) => (
                    <tr key={carrier.carrierId}>
                      <th scope="row" className={nameCell}>
                        {carrier.name}
                        {carrier.deleted ? ' (архив)' : ''}
                      </th>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <QuantityRead value={carrier.planQuantityThousandths} unit={block.quantityUnit} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={carrier.planUnitPriceExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={carrier.planAmountExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <QuantityRead value={carrier.factQuantityThousandths} unit={block.quantityUnit} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={carrier.factAmountExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={carrier.varianceAmountExVat} signed sense="cost" />
                      </td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <th scope="row" className={nameCell}>
                      Итого
                    </th>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <QuantityRead value={block.planQuantityThousandths} unit={block.quantityUnit} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={block.planUnitPriceExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={block.planAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <QuantityRead value={block.factQuantityThousandths} unit={block.quantityUnit} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={block.factAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={block.varianceAmountExVat} signed sense="cost" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Собственный транспорт</h2>
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Собственный транспорт, ${selectedMonth}`}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Автомобиль" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, л/100 км" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, цена топлива" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, км" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, сумма" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Факт, км" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Факт, сумма" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Откл., сумма" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.own.map((vehicle) => (
                  <tr key={vehicle.vehicleId}>
                    <th scope="row" className={nameCell}>
                      {vehicle.name}
                    </th>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <QuantityRead value={vehicle.litersPer100KmThousandths} unit="л" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={vehicle.planFuelPriceExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <QuantityRead value={vehicle.planKmThousandths} unit="км" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={vehicle.planAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <QuantityRead value={vehicle.factKmThousandths} unit="км" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={vehicle.factAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={vehicle.varianceAmountExVat} signed sense="cost" />
                    </td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <th scope="row" className={nameCell}>
                    Итого
                  </th>
                  <td className={`${valueCell} ${cellKindClassName.computed}`} colSpan={3} />
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={view.ownTotalPlanExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`} />
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={view.ownTotalFactExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={view.ownTotalFactExVat - view.ownTotalPlanExVat} signed sense="cost" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
