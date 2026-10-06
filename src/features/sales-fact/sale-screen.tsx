'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import {
  isOccurredOn,
  MAX_LABEL_LENGTH,
  type SaleLine,
} from '@/domain/document';
import { amountExVat } from '@/domain/money';
import { activeProducts } from '@/domain/products';
import { defaultSaleDay, saleByIdOrNull, saleTotals } from '@/domain/sales';
import { monthKeyFromDate } from '@/domain/sales-plan';
import {
  fieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { formatMoney } from '@/features/sales/money';
import { priceDraft } from '@/features/sales/text';
import {
  deletedSalesHref,
  SALES_SECTION_TITLE,
  saleHref,
  salesFactHref,
} from '@/features/sales-fact/paths';
import {
  formatSaleDate,
  parseSaleAmount,
  parseSalePieces,
  SALE_ERROR,
} from '@/features/sales-fact/text';
import { useSalesJournal } from '@/features/sales-fact/use-sales-journal';
import {
  IconCheck,
  IconPlus,
  IconTrash,
  IconUndo,
} from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

interface LineDraft {
  key: string;
  id: string;
  productId: string;
  pieces: string;
  amount: string;
}

function emptyLine(): LineDraft {
  return {
    key: crypto.randomUUID(),
    id: `sale-line:${crypto.randomUUID()}`,
    productId: '',
    pieces: '',
    amount: '',
  };
}

export function SaleScreen({
  saleId,
  dayQuery,
}: {
  saleId: string | null;
  dayQuery: string;
}) {
  const journal = useSalesJournal();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const existing = saleId ? saleByIdOrNull(journal.document, saleId) : null;

  if (saleId && !existing) {
    return (
      <PageFrame
        title={SALES_SECTION_TITLE}
        lede="Продажа заказчику: дата, товары и сумма."
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">
          Запись не найдена.
        </p>
        <Link
          href={salesFactHref({ month: currentMonth, currentMonth })}
          className={quietLinkClassName}
        >
          <IconUndo />К продажам
        </Link>
      </PageFrame>
    );
  }

  if (existing && existing.deletedAt !== null) {
    return (
      <DeletedSale
        id={existing.id}
        customerName={existing.customerName}
        occurredOn={existing.occurredOn}
      />
    );
  }

  const initialDay =
    existing?.occurredOn ??
    (isOccurredOn(dayQuery) ? dayQuery : defaultSaleDay(currentMonth, today));

  return (
    <SaleForm
      saleId={existing?.id ?? null}
      initialCustomer={existing?.customerName ?? ''}
      initialDay={initialDay}
      initialLines={
        existing
          ? existing.lines.map((line) => ({
              key: line.id,
              id: line.id,
              productId: line.productId,
              pieces: String(line.pieces),
              amount: priceDraft(line.amountWithVat),
            }))
          : [emptyLine()]
      }
    />
  );
}

function SaleForm({
  saleId,
  initialCustomer,
  initialDay,
  initialLines,
}: {
  saleId: string | null;
  initialCustomer: string;
  initialDay: string;
  initialLines: LineDraft[];
}) {
  const journal = useSalesJournal();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const maxDay = defaultSaleDay(currentMonth, today);
  const customerId = useId();
  const dateId = useId();
  const [customer, setCustomer] = useState(initialCustomer);
  const [occurredOn, setOccurredOn] = useState(initialDay);
  const [lines, setLines] = useState(initialLines);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lineError, setLineError] = useState<string | null>(null);
  const products = activeProducts(journal.document);
  const referenced = new Set(
    lines.map((line) => line.productId).filter(Boolean),
  );
  const catalog = journal.document.products.filter(
    (item) => item.deletedAt === null || referenced.has(item.id),
  );

  function setLine(key: string, patch: Partial<LineDraft>) {
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  }

  function parsedLines(): SaleLine[] | null {
    const result: SaleLine[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
      if (!line.productId) {
        setSaveError(SALE_ERROR.product);
        return null;
      }
      if (seen.has(line.productId)) {
        setSaveError(SALE_ERROR['duplicate-line']);
        return null;
      }
      const pieces = parseSalePieces(line.pieces);
      if (pieces === null) {
        setSaveError(SALE_ERROR.pieces);
        return null;
      }
      const amount = parseSaleAmount(line.amount);
      if (amount === null) {
        setSaveError(SALE_ERROR.amount);
        return null;
      }
      seen.add(line.productId);
      result.push({
        id: line.id,
        productId: line.productId,
        pieces,
        amountWithVat: amount,
      });
    }

    return result;
  }

  function save() {
    const nextLines = parsedLines();
    if (!nextLines) {
      return;
    }

    const rejection = saleId
      ? journal.update(saleId, customer, occurredOn, nextLines)
      : journal.add(customer, occurredOn, nextLines).rejection;
    if (rejection) {
      setSaveError(SALE_ERROR[rejection]);
      return;
    }

    const saleMonth = occurredOn.slice(0, 7);
    router.replace(
      salesFactHref({
        month: saleMonth || currentMonth,
        currentMonth,
        day: occurredOn,
        defaultDay: `${saleMonth || currentMonth}-01`,
        view: 'day',
      }),
    );
  }

  const month = occurredOn.slice(0, 7);

  return (
    <PageFrame
      title={SALES_SECTION_TITLE}
      lede="Продажа заказчику: дата, товары и сумма."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={salesFactHref({
              month: month || currentMonth,
              currentMonth,
              day: occurredOn,
              defaultDay: `${month || currentMonth}-01`,
              view: 'day',
            })}
            className={quietLinkClassName}
          >
            <IconUndo />К продажам
          </Link>
          {saleId ? (
            <button
              type="button"
              aria-label="Удалить продажу"
              onClick={() => {
                const confirmed = window.confirm(
                  'Удалить продажу? Она пропадёт из рабочего списка. Вернуть можно среди удалённых.',
                );
                if (!confirmed) {
                  return;
                }
                journal.remove(saleId);
                router.push(
                  salesFactHref({
                    month: month || currentMonth,
                    currentMonth,
                  }),
                );
              }}
              className="inline-flex h-11 items-center justify-center gap-2 px-3 text-sm text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <IconTrash />
              Удалить
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 border border-line bg-sheet p-4 sm:grid-cols-2">
          <div>
            <label htmlFor={dateId} className="text-sm text-muted">
              Дата
            </label>
            <input
              id={dateId}
              type="date"
              min="2000-01-01"
              max={maxDay}
              value={occurredOn}
              onChange={(event) => setOccurredOn(event.target.value)}
              className={`mt-2 ${fieldClassName}`}
            />
          </div>
          <div>
            <label htmlFor={customerId} className="text-sm text-muted">
              Заказчик
            </label>
            <input
              id={customerId}
              value={customer}
              maxLength={MAX_LABEL_LENGTH}
              onChange={(event) => setCustomer(event.target.value)}
              className={`mt-2 ${fieldClassName}`}
            />
          </div>
        </div>

        {products.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Сначала добавьте товар на{' '}
            <Link
              href="/"
              className="text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Сводке
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto border border-line bg-sheet">
            <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
              <caption className="sr-only">Товары продажи</caption>
              <thead>
                <tr>
                  <th className="border-b border-line px-3 py-2 text-left font-normal text-muted">
                    Товар
                  </th>
                  <th className="border-b border-line px-3 py-2 text-right font-normal text-muted">
                    Шт
                  </th>
                  <th className="border-b border-line px-3 py-2 text-right font-normal text-muted">
                    Сумма с НДС
                  </th>
                  <th className="border-b border-line px-3 py-2 text-right font-normal text-muted">
                    Сумма без НДС
                  </th>
                  <th className="border-b border-line px-3 py-2">
                    <span className="sr-only">Удалить строку</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const product = catalog.find(
                    (item) => item.id === line.productId,
                  );
                  const amount = parseSaleAmount(line.amount);
                  const ex =
                    product && amount !== null
                      ? amountExVat(amount, product.vatPercent)
                      : null;
                  return (
                    <tr key={line.key}>
                      <td className="border-b border-line px-3 py-2">
                        <select
                          aria-label="Товар"
                          value={line.productId}
                          onChange={(event) =>
                            setLine(line.key, { productId: event.target.value })
                          }
                          className={fieldClassName}
                        >
                          <option value="">Выберите товар</option>
                          {catalog.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                              {item.deletedAt ? ' · удалён' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-line px-3 py-2">
                        <input
                          aria-label="Штуки"
                          inputMode="numeric"
                          value={line.pieces}
                          onChange={(event) =>
                            setLine(line.key, { pieces: event.target.value })
                          }
                          className={`${fieldClassName} text-right`}
                        />
                      </td>
                      <td className="border-b border-line px-3 py-2">
                        <input
                          aria-label="Сумма с НДС"
                          inputMode="decimal"
                          value={line.amount}
                          onChange={(event) =>
                            setLine(line.key, { amount: event.target.value })
                          }
                          className={`${fieldClassName} text-right`}
                        />
                      </td>
                      <td className="border-b border-line px-3 py-2 text-right whitespace-nowrap">
                        {ex === null ? '—' : formatMoney(ex)}
                      </td>
                      <td className="border-b border-line px-2 py-2 text-right">
                        <button
                          type="button"
                          aria-label="Удалить строку"
                          onClick={() => {
                            setLines((current) =>
                              current.filter((item) => item.key !== line.key),
                            );
                            setLineError(null);
                          }}
                          className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        >
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <button
            type="button"
            onClick={() => {
              if (products.length === 0) {
                setLineError('Сначала добавьте товар на Сводке.');
                return;
              }
              setLines((current) => [...current, emptyLine()]);
              setLineError(null);
            }}
            className={quietLinkClassName}
          >
            <IconPlus />
            Добавить товар
          </button>
          <button
            type="button"
            disabled={!journal.hydrated}
            onClick={save}
            className={primaryButtonClassName}
          >
            <IconCheck />
            Сохранить
          </button>
        </div>
        {lineError ? <p className="text-sm text-ink">{lineError}</p> : null}
        {saveError ? <p className="text-sm text-ink">{saveError}</p> : null}
      </div>
    </PageFrame>
  );
}

function DeletedSale({
  id,
  customerName,
  occurredOn,
}: {
  id: string;
  customerName: string;
  occurredOn: string;
}) {
  const journal = useSalesJournal();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const [error, setError] = useState<string | null>(null);
  const sale = saleByIdOrNull(journal.document, id);
  const totals = sale ? saleTotals(journal.document, sale) : null;

  return (
    <PageFrame
      title={SALES_SECTION_TITLE}
      lede="Удалённую продажу можно открыть и вернуть."
    >
      <div className="flex flex-col gap-4">
        <Link href={deletedSalesHref()} className={quietLinkClassName}>
          <IconUndo />К удалённым продажам
        </Link>
        <div className="border border-line bg-sheet p-4">
          <p className="text-sm text-ink">{customerName}</p>
          <p className="mt-1 text-sm text-muted">
            {formatSaleDate(occurredOn)}
          </p>
          {totals?.revenueWithVat !== null &&
          totals?.revenueWithVat !== undefined &&
          totals.revenueExVat !== null ? (
            <p className="mt-2 text-sm text-ink">
              {formatMoney(totals.revenueWithVat)} с НДС ·{' '}
              {formatMoney(totals.revenueExVat)} без НДС
            </p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!journal.hydrated}
          onClick={() => {
            const rejection = journal.restore(id);
            if (rejection) {
              setError(SALE_ERROR[rejection]);
              return;
            }
            router.push(saleHref(id));
          }}
          className={primaryButtonClassName}
        >
          <IconUndo />
          Вернуть
        </button>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <Link
          href={salesFactHref({ month: currentMonth, currentMonth })}
          className={quietLinkClassName}
        >
          <IconUndo />К продажам
        </Link>
      </div>
    </PageFrame>
  );
}

const quietLinkClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
