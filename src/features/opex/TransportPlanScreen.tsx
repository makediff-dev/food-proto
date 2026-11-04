'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { TransportHireKind } from '@/domain/document';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { transportMonthView } from '@/domain/transport';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_TRANSPORT_PLAN_TITLE, opexTransportPlanHref } from '@/features/opex/paths';
import { parseOpexMoney, TRANSPORT_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { FIELD_ERROR, fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus, IconTrash } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  GridText,
  MoneyAmount,
  MoneyCell,
  nameCellKind,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const deleteIconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function TransportPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const view = useMemo(() => transportMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);
  const [addKind, setAddKind] = useState<TransportHireKind | null>(null);

  return (
    <PageFrame
      title={OPEX_TRANSPORT_PLAN_TITLE}
      full
      lede="План наёмного транспорта по контрагентам и план топлива собственных автомобилей."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexTransportPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {view.hire.map((block) => (
          <section key={block.kind} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h2 className="text-sm font-medium">{block.name}</h2>
              {editable ? (
                <button type="button" className={primaryButtonClassName} onClick={() => setAddKind(block.kind)}>
                  <IconPlus />
                  Добавить контрагента
                </button>
              ) : null}
            </div>
            <div className={tableFrameClassName}>
              <table className={tableClassName}>
                <caption className="sr-only">{`План, ${block.name}`}</caption>
                <thead>
                  <tr>
                    <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                      <ColumnLabel label="Контрагент" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label={`Кол-во, ${block.quantityUnit}`} />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Цена" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Сумма" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {block.carriers.map((carrier) => {
                    const canRename = editable && !carrier.deleted;
                    return (
                      <tr key={carrier.carrierId}>
                        <th scope="row" className={entityNameRowClassName(nameCellKind(canRename))}>
                          <div className="flex w-full items-center gap-2">
                            <span className="min-w-0 flex-1">
                              {canRename ? (
                                <GridText
                                  label={`Название, ${carrier.name}`}
                                  value={carrier.name}
                                  invalidMessage={FIELD_ERROR.empty}
                                  onCommit={(next) => {
                                    const rejection = opex.renameTransportCarrier(carrier.carrierId, next);
                                    return rejection ? TRANSPORT_ERROR[rejection] : null;
                                  }}
                                />
                              ) : (
                                <span className="text-sm leading-8 text-ink">
                                  {carrier.name}
                                  {carrier.deleted ? <span className="text-muted"> (архив)</span> : null}
                                </span>
                              )}
                            </span>
                            {editable && !carrier.deleted ? (
                              <button
                                type="button"
                                aria-label={`Удалить ${carrier.name}`}
                                title="Удалить"
                                className={deleteIconButtonClassName}
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Удалить «${carrier.name}»? Контрагент пропадёт из рабочего списка.`,
                                  );
                                  if (confirmed) {
                                    opex.deleteTransportCarrier(carrier.carrierId);
                                  }
                                }}
                              >
                                <IconTrash />
                              </button>
                            ) : null}
                          </div>
                        </th>
                        <td
                          className={`${valueCell} ${cellKindClassName[editable && !carrier.deleted ? 'assigned' : 'computed']}`}
                        >
                          {editable && !carrier.deleted ? (
                            <QuantityCell
                              label={`План, ${block.quantityUnit}, ${carrier.name}`}
                              value={carrier.planQuantityThousandths}
                              unit={block.quantityUnit}
                              blankIfZero
                              onChange={(next) => {
                                const rejection = opex.setTransportHirePlan(
                                  selectedMonth,
                                  carrier.carrierId,
                                  next,
                                  carrier.planUnitPriceExVat,
                                );
                                return rejection ? TRANSPORT_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            carrier.planQuantityThousandths
                          )}
                        </td>
                        <td
                          className={`${valueCell} ${cellKindClassName[editable && !carrier.deleted ? 'assigned' : 'computed']}`}
                        >
                          {editable && !carrier.deleted ? (
                            <MoneyCell
                              label={`Цена, ${carrier.name}`}
                              value={carrier.planUnitPriceExVat}
                              parse={parseOpexMoney}
                              invalidMessage={TRANSPORT_ERROR.price}
                              onChange={(next) => {
                                const rejection = opex.setTransportHirePlan(
                                  selectedMonth,
                                  carrier.carrierId,
                                  carrier.planQuantityThousandths,
                                  next,
                                );
                                return rejection ? TRANSPORT_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            <MoneyAmount amount={carrier.planUnitPriceExVat} />
                          )}
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed}`}>
                          <MoneyAmount amount={carrier.planAmountExVat} />
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
              <caption className="sr-only">План собственного транспорта</caption>
              <thead>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Автомобиль" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="л/100 км" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Цена топлива" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, км" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Сумма" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.own.map((vehicle) => (
                  <tr key={vehicle.vehicleId}>
                    <th scope="row" className={entityNameRowClassName('repeated')}>
                      {vehicle.name}
                    </th>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <QuantityCell
                          label={`л/100 км, ${vehicle.name}`}
                          value={vehicle.litersPer100KmThousandths}
                          unit="л"
                          blankIfZero
                          onChange={(next) => {
                            const rejection = opex.setTransportOwnPlan(
                              selectedMonth,
                              vehicle.vehicleId,
                              next,
                              vehicle.planFuelPriceExVat,
                              vehicle.planKmThousandths,
                            );
                            return rejection ? TRANSPORT_ERROR[rejection] : null;
                          }}
                        />
                      ) : (
                        vehicle.litersPer100KmThousandths
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <MoneyCell
                          label={`Цена топлива, ${vehicle.name}`}
                          value={vehicle.planFuelPriceExVat}
                          parse={parseOpexMoney}
                          invalidMessage={TRANSPORT_ERROR.price}
                          onChange={(next) => {
                            const rejection = opex.setTransportOwnPlan(
                              selectedMonth,
                              vehicle.vehicleId,
                              vehicle.litersPer100KmThousandths,
                              next,
                              vehicle.planKmThousandths,
                            );
                            return rejection ? TRANSPORT_ERROR[rejection] : null;
                          }}
                        />
                      ) : (
                        <MoneyAmount amount={vehicle.planFuelPriceExVat} />
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <QuantityCell
                          label={`План км, ${vehicle.name}`}
                          value={vehicle.planKmThousandths}
                          unit="км"
                          blankIfZero
                          onChange={(next) => {
                            const rejection = opex.setTransportOwnPlan(
                              selectedMonth,
                              vehicle.vehicleId,
                              vehicle.litersPer100KmThousandths,
                              vehicle.planFuelPriceExVat,
                              next,
                            );
                            return rejection ? TRANSPORT_ERROR[rejection] : null;
                          }}
                        />
                      ) : (
                        vehicle.planKmThousandths
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={vehicle.planAmountExVat} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {addKind && editable ? (
        <AddCarrierDialog
          onClose={() => setAddKind(null)}
          onSubmit={(name) => {
            const rejection = opex.addTransportCarrier(addKind, name);
            if (rejection) {
              return TRANSPORT_ERROR[rejection];
            }
            setAddKind(null);
            return null;
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function AddCarrierDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (name: string) => string | null }) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog title="Новый контрагент" onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const message = onSubmit(name);
          if (message) {
            setError(message);
          }
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span>Название</span>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={fieldClassName}
            autoComplete="off"
          />
        </label>
        {error ? <p className="text-sm text-negative">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className={primaryButtonClassName} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={primaryButtonClassName}>
            <IconPlus />
            Добавить
          </button>
        </div>
      </form>
    </Dialog>
  );
}
