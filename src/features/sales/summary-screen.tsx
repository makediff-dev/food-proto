'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';
import { activeCategories, deletedCategories } from '@/domain/categories';
import { normalizeName } from '@/domain/directory';
import { MAX_LABEL_LENGTH } from '@/domain/document';
import { activeProducts, deletedProducts } from '@/domain/products';
import {
  daysInMonth,
  missingPlanProducts,
  monthKeyFromDate,
  planPhase,
  shiftMonth,
  workingSalesPlan,
} from '@/domain/sales-plan';
import {
  applySummaryLens,
  lastHorizonMonth,
  monthSummary,
  type SummaryLens,
  summaryMonthOpen,
} from '@/domain/summary';
import {
  FIELD_ERROR,
  fieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { summaryHref } from '@/features/sales/paths';
import { SummaryHeadlineTable } from '@/features/sales/summary-headline';
import { SummaryTable } from '@/features/sales/summary-table';
import {
  daysPhrase,
  OPERATING_EXPENSE_ERROR,
  SALES_PLAN_ERROR,
} from '@/features/sales/text';
import { useSales } from '@/features/sales/use-sales';
import { Dialog } from '@/features/shell/dialog';
import {
  IconChevronLeft,
  IconChevronRight,
  IconFullscreen,
  IconFullscreenExit,
  IconPlus,
  IconUndo,
} from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

export function SummaryScreen({
  month,
  view,
}: {
  month: string;
  view: SummaryLens;
}) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return (
    <Workspace
      month={selectedMonth}
      currentMonth={currentMonth}
      today={today}
      view={view}
    />
  );
}

function Workspace({
  month,
  currentMonth,
  today,
  view,
}: {
  month: string;
  currentMonth: string;
  today: Date;
  view: SummaryLens;
}) {
  const sales = useSales();
  const router = useRouter();
  const monthFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const storedPlan = workingSalesPlan(sales.document, month);
  const summary = useMemo(
    () => applySummaryLens(monthSummary(sales.document, month), view, today),
    [sales.document, month, today, view],
  );
  const products = activeProducts(sales.document);
  const categories = activeCategories(sales.document);
  const removedProducts = deletedProducts(sales.document);
  const removedCategories = deletedCategories(sales.document);
  const removedCount = removedProducts.length + removedCategories.length;
  const phase = planPhase(month, today);
  const catalogEditable = sales.hydrated;
  const planMetricsEditable = sales.hydrated && view === 'forecast';
  const editable =
    planMetricsEditable && phase !== 'past' && products.length > 0;
  const missing =
    editable && storedPlan
      ? missingPlanProducts(sales.document, storedPlan)
      : [];
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);
  const hasTable = summary.groups.length > 0;
  const tableExpanded = fullscreen && hasTable;

  useEffect(() => {
    if (!tableExpanded) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFullscreen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [tableExpanded]);

  function open(nextMonthKey: string, nextView: SummaryLens = view) {
    router.push(
      summaryHref({ month: nextMonthKey, currentMonth, view: nextView }),
      {
        scroll: false,
      },
    );
  }

  function addMissing() {
    if (!storedPlan) {
      return;
    }

    const lines = missing.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
    }));
    const rejection = sales.addMissing(storedPlan.id, lines);
    setAddError(rejection ? SALES_PLAN_ERROR[rejection] : null);
  }

  return (
    <>
      <PageFrame
        title={
          <SummaryModeTitle
            view={view}
            onSelect={(next) => open(month, next)}
          />
        }
        full
        lede={lede(phase, daysInMonth(month), view)}
        intro={
          <div className="w-full border border-line bg-sheet p-4">
            <label htmlFor={monthFieldId} className="text-sm text-muted">
              Месяц
            </label>
            <div className="mt-2 flex items-center gap-2">
              <MonthStep
                label="Предыдущий месяц"
                direction="previous"
                disabled={!summaryMonthOpen(previousMonth, today)}
                onClick={() => open(previousMonth)}
              />
              <input
                id={monthFieldId}
                type="month"
                min="2000-01"
                max={horizonEnd}
                value={month}
                onChange={(event) => {
                  const next = event.target.value;
                  if (summaryMonthOpen(next, today)) {
                    open(next);
                  }
                }}
                className={`!w-48 shrink-0 ${fieldClassName}`}
              />
              <MonthStep
                label="Следующий месяц"
                direction="next"
                disabled={nextMonth > horizonEnd}
                onClick={() => open(nextMonth)}
              />
            </div>
          </div>
        }
        aside={
          <SummaryHeadlineTable
            headline={summary.headline}
            month={month}
            view={view}
            planEditable={planMetricsEditable}
            factEditable={catalogEditable}
            onOperatingExpense={(side, amountExVat) => {
              const rejection = sales.updateOperatingExpense(
                month,
                side,
                amountExVat,
              );
              return rejection ? OPERATING_EXPENSE_ERROR[rejection] : null;
            }}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!sales.hydrated || categories.length === 0}
              onClick={() => {
                setAddCategoryId(null);
                setAddOpen(true);
              }}
              className={
                categories.length === 0
                  ? 'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60'
                  : primaryButtonClassName
              }
            >
              <IconPlus />
              Добавить товар
            </button>
            <button
              type="button"
              disabled={!sales.hydrated}
              onClick={() => setAddCategoryOpen(true)}
              className={
                categories.length === 0
                  ? primaryButtonClassName
                  : 'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60'
              }
            >
              <IconPlus />
              Добавить категорию
            </button>
          </div>

          {missing.length > 0 ? (
            <div className="flex flex-col gap-3 border border-line bg-sheet p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink">
                В справочнике есть товары, которых нет в этом плане.
              </p>
              <div className="flex flex-col gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={addMissing}
                  className={`w-full sm:w-auto ${primaryButtonClassName}`}
                >
                  <IconPlus />
                  Добавить новые товары
                </button>
                {addError ? (
                  <p className="text-sm text-ink">{addError}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {removedCount > 0 ? (
            <DeletedRecords
              categories={removedCategories}
              products={removedProducts}
              error={restoreError}
              hydrated={sales.hydrated}
              onRestoreCategory={(id) => {
                const rejection = sales.restoreCategory(id);
                setRestoreError(rejection ? FIELD_ERROR[rejection] : null);
              }}
              onRestoreProduct={(id) => {
                const rejection = sales.restoreProduct(id);
                setRestoreError(rejection ? FIELD_ERROR[rejection] : null);
              }}
            />
          ) : null}

          {hasTable ? (
            <section
              className={
                tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined
              }
              aria-label={
                tableExpanded ? 'Таблица на весь экран' : 'Таблица сводки'
              }
            >
              <SummaryTable
                groups={summary.groups}
                planTotals={summary.planTotalsSide}
                factTotals={summary.factTotals}
                variance={summary.variance}
                view={view}
                editable={editable}
                vatEditable={planMetricsEditable}
                catalogEditable={catalogEditable}
                expanded={tableExpanded}
                onPlanLineAction={(lineId, priceWithVat, volumePieces) => {
                  return sales.updateMonthLine(
                    month,
                    lineId,
                    priceWithVat,
                    volumePieces,
                  );
                }}
                onProductVatAction={(productId, vatPercent) => {
                  const rejection = sales.updateProductVat(
                    productId,
                    vatPercent,
                  );
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
                onProductCostAction={(productId, unitCostWithVat) => {
                  const rejection = sales.updateProductCost(
                    productId,
                    unitCostWithVat,
                  );
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
                onRenameProduct={(productId, name) => {
                  const rejection = sales.renameProduct(productId, name);
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
                onRenameCategory={(categoryId, name) => {
                  const rejection = sales.renameCategory(categoryId, name);
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
                onDeleteCategory={(categoryId, name) => {
                  const confirmed = window.confirm(
                    `Удалить категорию «${name}»? Она и её товары пропадут из рабочего списка. Вернуть можно среди удалённых.`,
                  );
                  if (confirmed) {
                    sales.deleteCategory(categoryId);
                  }
                }}
                onDeleteProduct={(productId, name) => {
                  const confirmed = window.confirm(
                    `Удалить товар «${name}»? Он пропадёт из рабочего списка. Вернуть можно среди удалённых.`,
                  );
                  if (confirmed) {
                    sales.deleteProduct(productId);
                  }
                }}
                onAddProduct={(categoryId) => {
                  setAddCategoryId(categoryId);
                  setAddOpen(true);
                }}
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0
                ? 'Добавьте категорию, затем товар. План и факт строятся по товарам.'
                : 'Добавьте товар в категорию. План и факт строятся по товарам.'}
            </p>
          )}
        </div>
      </PageFrame>

      {addOpen ? (
        <AddProductDialog
          categories={categories}
          initialCategoryId={addCategoryId}
          onClose={() => setAddOpen(false)}
          onSubmit={(name, categoryId) => {
            const rejection = sales.addProduct(name, categoryId);
            if (rejection) {
              return FIELD_ERROR[rejection];
            }
            setAddOpen(false);
            return null;
          }}
        />
      ) : null}

      {addCategoryOpen ? (
        <AddCategoryDialog
          onClose={() => setAddCategoryOpen(false)}
          onSubmit={(name) => {
            const rejection = sales.addCategory(name);
            if (rejection) {
              return FIELD_ERROR[rejection];
            }
            setAddCategoryOpen(false);
            return null;
          }}
        />
      ) : null}

      {hasTable ? (
        <FullscreenToggle
          active={tableExpanded}
          onToggle={() => setFullscreen((current) => !current)}
        />
      ) : null}
    </>
  );
}

function AddProductDialog({
  categories,
  initialCategoryId,
  onClose,
  onSubmit,
}: {
  categories: readonly { id: string; name: string }[];
  initialCategoryId: string | null;
  onClose: () => void;
  onSubmit: (name: string, categoryId: string) => string | null;
}) {
  const nameId = useId();
  const categoryFieldId = useId();
  const errorId = useId();
  const [name, setName] = useState('');
  const lockedCategory = categories.find(
    (item) => item.id === initialCategoryId,
  );
  const [categoryId, setCategoryId] = useState(
    lockedCategory?.id ?? categories[0]?.id ?? '',
  );
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (normalizeName(name).length === 0) {
      setError(FIELD_ERROR.empty);
      return;
    }
    if (normalizeName(name).length > MAX_LABEL_LENGTH) {
      setError(FIELD_ERROR['too-long']);
      return;
    }
    if (!categoryId) {
      setError(FIELD_ERROR.category);
      return;
    }

    const rejection = onSubmit(name, categoryId);
    if (rejection) {
      setError(rejection);
    }
  }

  return (
    <Dialog title="Новый товар" onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div>
          <label htmlFor={nameId} className="text-sm text-muted">
            Название
          </label>
          <input
            id={nameId}
            value={name}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={`mt-2 ${fieldClassName}`}
          />
        </div>
        <div>
          {lockedCategory ? (
            <>
              <p className="text-sm text-muted">Категория</p>
              <p className="mt-2 text-base text-ink">{lockedCategory.name}</p>
            </>
          ) : (
            <>
              <label htmlFor={categoryFieldId} className="text-sm text-muted">
                Категория
              </label>
              <select
                id={categoryFieldId}
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setError(null);
                }}
                className={`mt-2 ${fieldClassName}`}
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {error ? (
            <p id={errorId} className="mt-2 text-sm text-ink">
              {error}
            </p>
          ) : null}
        </div>
        <button type="submit" className={primaryButtonClassName}>
          <IconPlus />
          Добавить товар
        </button>
      </form>
    </Dialog>
  );
}

function AddCategoryDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string) => string | null;
}) {
  const nameId = useId();
  const errorId = useId();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (normalizeName(name).length === 0) {
      setError(FIELD_ERROR.empty);
      return;
    }
    if (normalizeName(name).length > MAX_LABEL_LENGTH) {
      setError(FIELD_ERROR['too-long']);
      return;
    }

    const rejection = onSubmit(name);
    if (rejection) {
      setError(rejection);
    }
  }

  return (
    <Dialog title="Новая категория" onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div>
          <label htmlFor={nameId} className="text-sm text-muted">
            Название
          </label>
          <input
            id={nameId}
            value={name}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={`mt-2 ${fieldClassName}`}
          />
          {error ? (
            <p id={errorId} className="mt-2 text-sm text-ink">
              {error}
            </p>
          ) : null}
        </div>
        <button type="submit" className={primaryButtonClassName}>
          <IconPlus />
          Добавить категорию
        </button>
      </form>
    </Dialog>
  );
}

function DeletedRecords({
  categories,
  products,
  error,
  hydrated,
  onRestoreCategory,
  onRestoreProduct,
}: {
  categories: { id: string; name: string }[];
  products: { id: string; name: string }[];
  error: string | null;
  hydrated: boolean;
  onRestoreCategory: (id: string) => void;
  onRestoreProduct: (id: string) => void;
}) {
  const empty = categories.length === 0 && products.length === 0;

  return (
    <div className="border border-line bg-sheet p-4">
      <h2 className="text-sm font-semibold text-ink">Удалённые</h2>
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
      {empty ? (
        <p className="mt-2 text-sm leading-6 text-muted">
          Удалённых категорий и товаров нет.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {categories.length > 0 ? (
            <div>
              <h3 className="text-sm text-muted">Категории</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {categories.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm text-ink">{item.name}</p>
                    <button
                      type="button"
                      disabled={!hydrated}
                      onClick={() => onRestoreCategory(item.id)}
                      className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
                    >
                      <IconUndo />
                      Вернуть
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {products.length > 0 ? (
            <div>
              <h3 className="text-sm text-muted">Товары</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {products.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm text-ink">{item.name}</p>
                    <button
                      type="button"
                      disabled={!hydrated}
                      onClick={() => onRestoreProduct(item.id)}
                      className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
                    >
                      <IconUndo />
                      Вернуть
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function lede(
  phase: ReturnType<typeof planPhase>,
  days: number,
  view: SummaryLens,
): string {
  const length = `В месяце ${daysPhrase(days)}.`;
  if (view === 'forecast') {
    if (phase === 'past') {
      return `Месяц прошёл. План и факт — за весь месяц. ${length}`;
    }
    if (phase === 'future') {
      return `План на месяц. Прогноз факта нулевой: продаж ещё нет. Плановые показатели, НДС и себестоимость правят здесь. ${length}`;
    }

    return `План на месяц. Факт — прогноз до конца месяца тем же темпом, что уже есть. Плановые показатели правят здесь. Факт считается из дней раздела «Продажи». ${length}`;
  }

  if (phase === 'past') {
    return `Месяц прошёл, план только для просмотра. Факт считается из дней раздела «Продажи». ${length}`;
  }
  if (phase === 'future') {
    return `План урезан до нуля: месяц ещё не начался. Факт нулевой. Плановые показатели правят в сводке за месяц. ${length}`;
  }

  return `Факт на сегодня. План урезан на прошедшую долю месяца. Плановые показатели здесь только для просмотра; правят в сводке за месяц. Факт считается из дней раздела «Продажи». ${length}`;
}

function SummaryModeTitle({
  view,
  onSelect,
}: {
  view: SummaryLens;
  onSelect: (next: SummaryLens) => void;
}) {
  return (
    <>
      Сводка{' '}
      <ModeWord
        label="текущая"
        active={view === 'current'}
        onClick={() => onSelect('current')}
      />
      {'/'}
      <ModeWord
        label="за месяц"
        active={view === 'forecast'}
        onClick={() => onSelect('forecast')}
      />
    </>
  );
}

function ModeWord({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  if (active) {
    return (
      <span className="underline decoration-ink underline-offset-4">
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={
        label === 'текущая'
          ? 'Показать текущую сводку'
          : 'Показать сводку за месяц'
      }
      onClick={onClick}
      className="font-[inherit] text-inherit underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {label}
    </button>
  );
}

function resolveMonth(month: string, today: Date): string {
  if (summaryMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
}

function MonthStep({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === 'previous' ? <IconChevronLeft /> : <IconChevronRight />}
    </button>
  );
}

function FullscreenToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={active ? 'Обычный режим' : 'На весь экран'}
      aria-pressed={active}
      title={active ? 'Обычный режим' : 'На весь экран'}
      onClick={onToggle}
      className="fixed right-5 bottom-5 z-60 inline-flex size-12 items-center justify-center rounded-full border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {active ? <IconFullscreenExit /> : <IconFullscreen />}
    </button>
  );
}
