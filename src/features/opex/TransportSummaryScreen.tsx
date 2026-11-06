'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { monthKeyFromDate } from '@/domain/sales-plan';
import { transportMonthView } from '@/domain/transport';
import { QuantityRead } from '@/features/materials/QuantityCell';
import {
  ReportSubBannerColumnHeaders,
  type ReportSubBannerGroup,
} from '@/features/movement/FinishedGoodsNormativeColumnHeading';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_TRANSPORT_TITLE, opexTransportHref } from '@/features/opex/paths';
import { useOpex } from '@/features/opex/use-opex';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

type HireColumnKey =
  | 'planQty'
  | 'planPrice'
  | 'planAmount'
  | 'factQty'
  | 'factPrice'
  | 'factAmount'
  | 'varianceQty'
  | 'variancePrice'
  | 'varianceAmount';

type OwnColumnKey =
  | 'planLiters'
  | 'planFuelPrice'
  | 'planKm'
  | 'planAmount'
  | 'factKm'
  | 'factAmount'
  | 'varianceAmount';

const HIRE_SUB_BANNERS: ReportSubBannerGroup[] = [
  { label: 'план', keys: ['planQty', 'planPrice', 'planAmount'] },
  { label: 'факт', keys: ['factQty', 'factPrice', 'factAmount'] },
  { label: 'отклонение', keys: ['varianceQty', 'variancePrice', 'varianceAmount'] },
];

const OWN_SUB_BANNERS: ReportSubBannerGroup[] = [
  { label: 'план', keys: ['planLiters', 'planFuelPrice', 'planKm', 'planAmount'] },
  { label: 'факт', keys: ['factKm', 'factAmount'] },
  { label: 'отклонение', keys: ['varianceAmount'] },
];

const HIRE_GROUP_END = new Set<HireColumnKey>(['planAmount', 'factAmount']);
const OWN_GROUP_END = new Set<OwnColumnKey>(['planAmount', 'factAmount']);

const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle`;

function hireGroupEndClass(key: HireColumnKey): string {
  return HIRE_GROUP_END.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

function ownGroupEndClass(key: OwnColumnKey): string {
  return OWN_GROUP_END.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

function hireColumns(): { key: HireColumnKey; label: string }[] {
  return [
    { key: 'planQty', label: 'Кол-во' },
    { key: 'planPrice', label: 'Цена' },
    { key: 'planAmount', label: 'Сумма' },
    { key: 'factQty', label: 'Кол-во' },
    { key: 'factPrice', label: 'Цена' },
    { key: 'factAmount', label: 'Сумма' },
    { key: 'varianceQty', label: 'Кол-во' },
    { key: 'variancePrice', label: 'Цена' },
    { key: 'varianceAmount', label: 'Сумма' },
  ];
}

const OWN_COLUMNS: { key: OwnColumnKey; label: string }[] = [
  { key: 'planLiters', label: 'л/100 км' },
  { key: 'planFuelPrice', label: 'Цена топлива' },
  { key: 'planKm', label: 'км' },
  { key: 'planAmount', label: 'Сумма' },
  { key: 'factKm', label: 'км' },
  { key: 'factAmount', label: 'Сумма' },
  { key: 'varianceAmount', label: 'Сумма' },
];

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
        {view.hire.map((block) => {
          const columns = hireColumns();
          return (
            <section key={block.kind} className="flex flex-col gap-2">
              <h2 className="px-1 text-sm font-medium">{block.name}</h2>
              <div className={tableFrameClassName}>
                <table className={tableClassName}>
                  <caption className="sr-only">{`${block.name}, ${selectedMonth}`}</caption>
                  <thead className={stickyHeadClassName}>
                    <tr>
                      <th rowSpan={2} scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                        Контрагент
                      </th>
                      <ReportSubBannerColumnHeaders
                        row="primary"
                        columns={columns}
                        subBannerGroups={HIRE_SUB_BANNERS}
                        groupEndClass={hireGroupEndClass}
                        lastColumnExtraClassName="last:border-r-0"
                      />
                    </tr>
                    <tr>
                      <ReportSubBannerColumnHeaders
                        row="secondary"
                        columns={columns}
                        subBannerGroups={HIRE_SUB_BANNERS}
                        groupEndClass={hireGroupEndClass}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {block.carriers.map((carrier) => (
                      <tr key={carrier.carrierId}>
                        <th scope="row" className={entityNameRowClassName('repeated')}>
                          {carrier.name}
                          {carrier.deleted ? ' (архив)' : ''}
                        </th>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planQty')}`}>
                          <QuantityRead value={carrier.planQuantityThousandths} unit={block.quantityUnit} />
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planPrice')}`}>
                          <MoneyAmount amount={carrier.planUnitPriceExVat} />
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planAmount')}`}>
                          <MoneyAmount amount={carrier.planAmountExVat} />
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factQty')}`}>
                          <QuantityRead value={carrier.factQuantityThousandths} unit={block.quantityUnit} />
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factPrice')}`}>
                          <MoneyCell
                            label="Факт, цена"
                            value={carrier.factQuantityThousandths > 0 ? carrier.factUnitPriceExVat : null}
                          />
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factAmount')}`}>
                          <MoneyAmount amount={carrier.factAmountExVat} />
                        </td>
                        <td
                          className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('varianceQty')}`}
                        >
                          <QuantityRead value={carrier.varianceQuantityThousandths} unit={block.quantityUnit} signed />
                        </td>
                        <td
                          className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('variancePrice')}`}
                        >
                          <MoneyCell label="Откл., цена" value={carrier.varianceUnitPriceExVat} signed sense="cost" />
                        </td>
                        <td
                          className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('varianceAmount')}`}
                        >
                          <MoneyAmount amount={carrier.varianceAmountExVat} signed sense="cost" />
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <th scope="row" className={categoryNameRowClassName(false)}>
                        Итого
                      </th>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planQty')}`}>
                        <QuantityRead value={block.planQuantityThousandths} unit={block.quantityUnit} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planPrice')}`}>
                        <MoneyAmount amount={block.planUnitPriceExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('planAmount')}`}>
                        <MoneyAmount amount={block.planAmountExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factQty')}`}>
                        <QuantityRead value={block.factQuantityThousandths} unit={block.quantityUnit} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factPrice')}`}>
                        <MoneyCell
                          label="Факт, цена"
                          value={block.factQuantityThousandths > 0 ? block.factUnitPriceExVat : null}
                        />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('factAmount')}`}>
                        <MoneyAmount amount={block.factAmountExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('varianceQty')}`}>
                        <QuantityRead value={block.varianceQuantityThousandths} unit={block.quantityUnit} signed />
                      </td>
                      <td
                        className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('variancePrice')}`}
                      >
                        <MoneyCell label="Откл., цена" value={block.varianceUnitPriceExVat} signed sense="cost" />
                      </td>
                      <td
                        className={`${valueCell} ${cellKindClassName.computed} ${hireGroupEndClass('varianceAmount')}`}
                      >
                        <MoneyAmount amount={block.varianceAmountExVat} signed sense="cost" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Собственный транспорт</h2>
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Собственный транспорт, ${selectedMonth}`}</caption>
              <thead className={stickyHeadClassName}>
                <tr>
                  <th rowSpan={2} scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    Автомобиль
                  </th>
                  <ReportSubBannerColumnHeaders
                    row="primary"
                    columns={OWN_COLUMNS}
                    subBannerGroups={OWN_SUB_BANNERS}
                    groupEndClass={ownGroupEndClass}
                    lastColumnExtraClassName="last:border-r-0"
                  />
                </tr>
                <tr>
                  <ReportSubBannerColumnHeaders
                    row="secondary"
                    columns={OWN_COLUMNS}
                    subBannerGroups={OWN_SUB_BANNERS}
                    groupEndClass={ownGroupEndClass}
                  />
                </tr>
              </thead>
              <tbody>
                {view.own.map((vehicle) => (
                  <tr key={vehicle.vehicleId}>
                    <th scope="row" className={entityNameRowClassName('repeated')}>
                      {vehicle.name}
                      {vehicle.deleted ? ' (архив)' : ''}
                    </th>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planLiters')}`}>
                      <QuantityRead value={vehicle.litersPer100KmThousandths} unit="л" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planFuelPrice')}`}>
                      <MoneyAmount amount={vehicle.planFuelPriceExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planKm')}`}>
                      <QuantityRead value={vehicle.planKmThousandths} unit="км" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planAmount')}`}>
                      <MoneyAmount amount={vehicle.planAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('factKm')}`}>
                      <QuantityRead value={vehicle.factKmThousandths} unit="км" />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('factAmount')}`}>
                      <MoneyAmount amount={vehicle.factAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('varianceAmount')}`}>
                      <MoneyAmount amount={vehicle.varianceAmountExVat} signed sense="cost" />
                    </td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <th scope="row" className={categoryNameRowClassName(false)}>
                    Итого
                  </th>
                  <td
                    className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planLiters')}`}
                    colSpan={3}
                  />
                  <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('planAmount')}`}>
                    <MoneyAmount amount={view.ownTotalPlanExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('factKm')}`} />
                  <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('factAmount')}`}>
                    <MoneyAmount amount={view.ownTotalFactExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed} ${ownGroupEndClass('varianceAmount')}`}>
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
