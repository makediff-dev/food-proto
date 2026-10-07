'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import {
  isOccurredOn,
  MAX_LABEL_LENGTH,
  type Product,
  type ProductCategory,
  type PrototypeDocument,
  type SaleLine,
} from '@/domain/document';
import { periodGridCategories, periodGridProducts } from '@/domain/period-grid';
import {
  defaultSaleDay,
  maxSaleOccurredOn,
  saleByIdOrNull,
  saleLineAmountWithVat,
  saleLinePriceWithVat,
} from '@/domain/sales';
import { monthKeyFromDate, salesPlanForMonth } from '@/domain/sales-plan';
import { planningHref } from '@/features/planning/paths';
import {
  fieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { priceDraft } from '@/features/sales/text';
import {
  NEW_SALE_TITLE,
  SALES_SECTION_TITLE,
  salesJournalHref,
} from '@/features/sales-fact/paths';
import {
  emptySaleLineDraft,
  SaleFormTable,
  type SaleLineDraft,
  type SaleLineField,
} from '@/features/sales-fact/sale-form-table';
import {
  hasAmountWithoutPieces,
  parseSaleAmount,
  parseSalePieces,
  parseSalePrice,
  SALE_ERROR,
} from '@/features/sales-fact/text';
import { useSalesJournal } from '@/features/sales-fact/use-sales-journal';
import { IconArrowLeft, IconCheck, IconTrash } from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

function lineDraftFromSale(line: SaleLine): SaleLineDraft {
  const price = saleLinePriceWithVat(line.amountWithVat, line.pieces);
  return {
    id: line.id,
    pieces: String(line.pieces),
    price: price === null ? '' : priceDraft(price),
    amount: priceDraft(line.amountWithVat),
  };
}

function planPriceWithVat(
  document: PrototypeDocument,
  productId: string,
  month: string,
): number {
  if (!productId || !month) {
    return 0;
  }

  const plan = salesPlanForMonth(document, month);
  const line = plan.lines.find((item) => item.productId === productId);
  return line?.priceWithVat ?? 0;
}

function withAmountFromPrice(line: SaleLineDraft): SaleLineDraft {
  const price = parseSalePrice(line.price);
  const pieces = parseSalePieces(line.pieces);
  if (price === null || pieces === null) {
    return line;
  }

  const amount = saleLineAmountWithVat(price, pieces);
  if (amount === null) {
    return line;
  }

  return { ...line, amount: priceDraft(amount) };
}

function withPriceFromAmount(line: SaleLineDraft): SaleLineDraft {
  const amount = parseSaleAmount(line.amount);
  const pieces = parseSalePieces(line.pieces);
  if (amount === null || pieces === null) {
    return line;
  }

  const price = saleLinePriceWithVat(amount, pieces);
  if (price === null) {
    return line;
  }

  return { ...line, price: priceDraft(price) };
}

function saleFormProducts(
  document: PrototypeDocument,
  month: string,
  lineProductIds: readonly string[],
): Product[] {
  const referenced = new Set(lineProductIds);
  const period = periodGridProducts(document, month);
  const periodIds = new Set(period.map((item) => item.id));
  const extras = document.products.filter(
    (item) => referenced.has(item.id) && !periodIds.has(item.id),
  );
  return [...period, ...extras];
}

function saleFormCategories(
  document: PrototypeDocument,
  products: readonly Product[],
): ProductCategory[] {
  return periodGridCategories(document, products);
}

function initialDrafts(
  document: PrototypeDocument,
  existingLines: readonly SaleLine[],
  month: string,
): Record<string, SaleLineDraft> {
  const byProduct = new Map(
    existingLines.map((line) => [line.productId, lineDraftFromSale(line)]),
  );
  const products = saleFormProducts(
    document,
    month,
    existingLines.map((line) => line.productId),
  );
  const drafts: Record<string, SaleLineDraft> = {};

  for (const product of products) {
    drafts[product.id] =
      byProduct.get(product.id) ??
      emptySaleLineDraft(planPriceWithVat(document, product.id, month));
  }

  return drafts;
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
        full
        lede="Продажа заказчику: дата, товары, цена и сумма."
        back={
          <Link
            href={salesJournalHref({ month: currentMonth, currentMonth })}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        }
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">
          Запись не найдена.
        </p>
      </PageFrame>
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
      initialDrafts={initialDrafts(
        journal.document,
        existing?.lines ?? [],
        initialDay.slice(0, 7),
      )}
    />
  );
}

function SaleForm({
  saleId,
  initialCustomer,
  initialDay,
  initialDrafts,
}: {
  saleId: string | null;
  initialCustomer: string;
  initialDay: string;
  initialDrafts: Record<string, SaleLineDraft>;
}) {
  const journal = useSalesJournal();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const maxDay = maxSaleOccurredOn(today);
  const customerId = useId();
  const dateId = useId();
  const [customer, setCustomer] = useState(initialCustomer);
  const [occurredOn, setOccurredOn] = useState(initialDay);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [saveError, setSaveError] = useState<string | null>(null);
  const month = occurredOn.slice(0, 7);

  const filledProductIds = useMemo(
    () =>
      Object.entries(drafts)
        .filter(([, line]) => {
          const pieces = parseSalePieces(line.pieces);
          const amount = parseSaleAmount(line.amount);
          return (
            (pieces !== null && pieces > 0) || (amount !== null && amount > 0)
          );
        })
        .map(([productId]) => productId),
    [drafts],
  );

  const products = saleFormProducts(journal.document, month, filledProductIds);
  const categories = saleFormCategories(journal.document, products);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const product of products) {
        if (next[product.id]) {
          continue;
        }
        next[product.id] = emptySaleLineDraft(
          planPriceWithVat(journal.document, product.id, month),
        );
        changed = true;
      }
      return changed ? next : current;
    });
  }, [products, journal.document, month]);

  function setLine(productId: string, field: SaleLineField, raw: string) {
    setDrafts((current) => {
      const line = current[productId];
      if (!line) {
        return current;
      }

      if (field === 'pieces') {
        const next = { ...line, pieces: raw };
        const updated =
          parseSalePrice(line.price) !== null
            ? withAmountFromPrice(next)
            : withPriceFromAmount(next);
        return { ...current, [productId]: updated };
      }

      if (field === 'price') {
        return {
          ...current,
          [productId]: withAmountFromPrice({ ...line, price: raw }),
        };
      }

      return {
        ...current,
        [productId]: withPriceFromAmount({ ...line, amount: raw }),
      };
    });
  }

  function parsedLines(): SaleLine[] | null {
    const result: SaleLine[] = [];

    for (const product of products) {
      const line = drafts[product.id];
      if (!line) {
        continue;
      }

      const pieces = parseSalePieces(line.pieces);
      const amount = parseSaleAmount(line.amount);
      const amountEntered = amount !== null && amount > 0;
      if (!amountEntered && pieces === null) {
        continue;
      }

      if (hasAmountWithoutPieces(line.pieces, line.amount) || pieces === null) {
        setSaveError(SALE_ERROR.pieces);
        return null;
      }
      if (amount === null) {
        setSaveError(SALE_ERROR.amount);
        return null;
      }

      result.push({
        id: line.id,
        productId: product.id,
        pieces,
        amountWithVat: amount,
      });
    }

    if (result.length === 0) {
      setSaveError(SALE_ERROR.lines);
      return null;
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
      salesJournalHref({
        month: saleMonth || currentMonth,
        currentMonth,
      }),
    );
  }

  const backHref = salesJournalHref({
    month: month || currentMonth,
    currentMonth,
  });

  return (
    <PageFrame
      title={saleId ? SALES_SECTION_TITLE : NEW_SALE_TITLE}
      full
      lede={
        saleId ? 'Продажа заказчику: дата, товары, цена и сумма.' : undefined
      }
      back={
        saleId ? (
          <Link
            href={backHref}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          {products.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Сначала добавьте товар в{' '}
              <Link
                href={planningHref()}
                className="text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Планировании
              </Link>
              .
            </p>
          ) : (
            <SaleFormTable
              categories={categories}
              products={products}
              drafts={drafts}
              onChange={setLine}
            />
          )}

          <div className="sticky top-16 z-20 flex w-72 shrink-0 flex-col gap-4 self-start border border-line bg-sheet p-4 lg:top-4">
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
            <button
              type="button"
              disabled={!journal.hydrated}
              onClick={save}
              className={`${primaryButtonClassName} w-full`}
            >
              <IconCheck />
              Сохранить
            </button>
            {saleId ? (
              <button
                type="button"
                aria-label="Удалить продажу"
                onClick={() => {
                  const confirmed = window.confirm(
                    'Удалить продажу? Её нельзя будет вернуть.',
                  );
                  if (!confirmed) {
                    return;
                  }
                  journal.remove(saleId);
                  router.push(
                    salesJournalHref({
                      month: month || currentMonth,
                      currentMonth,
                    }),
                  );
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 text-sm text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconTrash />
                Удалить
              </button>
            ) : null}
            {saveError ? <p className="text-sm text-ink">{saveError}</p> : null}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
