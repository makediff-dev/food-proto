'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import { activeCategories, deletedCategories } from '@/domain/categories';
import { activeProducts, deletedProducts } from '@/domain/products';
import {
  missingPlanProducts,
  monthKeyFromDate,
  planMonthOpen,
  shiftMonth,
  workingSalesPlan,
} from '@/domain/sales-plan';
import { lastHorizonMonth, monthSummary } from '@/domain/summary';
import { PLANNING_SECTION_TITLE, planningArchiveHref, planningHref } from '@/features/planning/paths';
import { FIELD_ERROR, fieldClassName, monthFieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { PlanHeadlineTable } from '@/features/sales/summary-headline';
import { SummaryTable } from '@/features/sales/summary-table';
import { OPERATING_EXPENSE_ERROR, SALES_PLAN_ERROR } from '@/features/sales/text';
import { useSales } from '@/features/sales/use-sales';
import { Dialog } from '@/features/shell/dialog';
import { IconFullscreen, IconFullscreenExit, IconPlus, IconTrash } from '@/features/shell/icons';
import { MonthStep } from '@/features/shell/month-step';
import { PageFrame } from '@/features/shell/page-frame';

export function PlanningScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return <Workspace month={selectedMonth} currentMonth={currentMonth} today={today} />;
}

function Workspace({ month, currentMonth, today }: { month: string; currentMonth: string; today: Date }) {
  const sales = useSales();
  const router = useRouter();
  const [fullscreen, setFullscreen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const storedPlan = workingSalesPlan(sales.document, month);
  const summary = useMemo(() => monthSummary(sales.document, month), [sales.document, month]);
  const products = activeProducts(sales.document);
  const categories = activeCategories(sales.document);
  const hasArchive = deletedProducts(sales.document).length > 0 || deletedCategories(sales.document).length > 0;
  const catalogEditable = sales.hydrated;
  const planEditable = sales.hydrated && products.length > 0;
  const missing = planEditable && storedPlan ? missingPlanProducts(sales.document, storedPlan) : [];
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

  function open(nextMonthKey: string) {
    router.push(planningHref({ month: nextMonthKey, currentMonth }), {
      scroll: false,
    });
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
        title={PLANNING_SECTION_TITLE}
        full
        intro={
          <div className="flex flex-col gap-4">
            <div className="w-full border border-line bg-sheet p-4">
              <div className="flex items-center gap-2">
                <MonthStep
                  label="Предыдущий месяц"
                  direction="previous"
                  disabled={!planMonthOpen(previousMonth, today)}
                  onClick={() => open(previousMonth)}
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
                      open(next);
                    }
                  }}
                  className={monthFieldClassName}
                />
                <MonthStep
                  label="Следующий месяц"
                  direction="next"
                  disabled={nextMonth > horizonEnd}
                  onClick={() => open(nextMonth)}
                />
              </div>
            </div>
            <PlanHeadlineTable
              headline={summary.headline}
              periodLabel={month}
              editable={sales.hydrated}
              onOperatingExpense={(amountExVat) => {
                const rejection = sales.updateOperatingExpense(month, 'plan', amountExVat);
                return rejection ? OPERATING_EXPENSE_ERROR[rejection] : null;
              }}
            />
          </div>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              disabled={!sales.hydrated || categories.length === 0}
              onClick={() => {
                setAddCategoryId(null);
                setAddOpen(true);
              }}
              className={categories.length === 0 ? quietButtonClassName : primaryButtonClassName}
            >
              <IconPlus />
              Добавить товар
            </button>
            <button
              type="button"
              disabled={!sales.hydrated}
              onClick={() => setAddCategoryOpen(true)}
              className={categories.length === 0 ? primaryButtonClassName : quietButtonClassName}
            >
              <IconPlus />
              Добавить категорию
            </button>
            {hasArchive ? (
              <Link href={planningArchiveHref()} className={quietButtonClassName}>
                <IconTrash />
                Архив
              </Link>
            ) : null}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {missing.length > 0 ? (
            <div className="flex flex-col gap-3 border border-line bg-sheet p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink">В справочнике есть товары, которых нет в этом плане.</p>
              <div className="flex flex-col gap-2 sm:items-end">
                <button type="button" onClick={addMissing} className={`w-full sm:w-auto ${primaryButtonClassName}`}>
                  <IconPlus />
                  Добавить новые товары
                </button>
                {addError ? <p className="text-sm text-ink">{addError}</p> : null}
              </div>
            </div>
          ) : null}

          {hasTable ? (
            <section
              className={tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined}
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица планирования'}
            >
              <SummaryTable
                groups={summary.groups}
                planTotals={summary.planTotalsSide}
                factTotals={summary.factTotals}
                variance={summary.variance}
                view="forecast"
                part="plan"
                expanded={tableExpanded}
                edit={{
                  plan: planEditable,
                  vat: catalogEditable,
                  catalog: catalogEditable,
                  onPlanLine: (lineId, priceWithVat, volumePieces) => {
                    return sales.updateMonthLine(month, lineId, priceWithVat, volumePieces);
                  },
                  onProductVat: (productId, vatPercent) => {
                    const rejection = sales.updateProductVat(productId, vatPercent);
                    return rejection ? FIELD_ERROR[rejection] : null;
                  },
                  onRenameProduct: (productId, name) => {
                    const rejection = sales.renameProduct(productId, name);
                    return rejection ? FIELD_ERROR[rejection] : null;
                  },
                  onRenameCategory: (categoryId, name) => {
                    const rejection = sales.renameCategory(categoryId, name);
                    return rejection ? FIELD_ERROR[rejection] : null;
                  },
                  onDeleteCategory: (categoryId, name) => {
                    const confirmed = window.confirm(
                      `Удалить категорию «${name}»? Она и её товары пропадут из рабочего списка. Вернуть можно в архиве.`,
                    );
                    if (confirmed) {
                      sales.deleteCategory(categoryId);
                    }
                  },
                  onDeleteProduct: (productId, name) => {
                    const confirmed = window.confirm(
                      `Удалить товар «${name}»? Он пропадёт из рабочего списка. Вернуть можно в архиве.`,
                    );
                    if (confirmed) {
                      sales.deleteProduct(productId);
                    }
                  },
                  onAddProduct: (categoryId) => {
                    setAddCategoryId(categoryId);
                    setAddOpen(true);
                  },
                }}
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0
                ? 'Добавьте категорию, затем товар. План строится по товарам.'
                : 'Добавьте товар в категорию. План строится по товарам.'}
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
        <FullscreenToggle active={tableExpanded} onToggle={() => setFullscreen((current) => !current)} />
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
  const lockedCategory = categories.find((item) => item.id === initialCategoryId);
  const [categoryId, setCategoryId] = useState(lockedCategory?.id ?? categories[0]?.id ?? '');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (name.trim().length === 0) {
      setError(FIELD_ERROR.empty);
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

function AddCategoryDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (name: string) => string | null }) {
  const nameId = useId();
  const errorId = useId();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (name.trim().length === 0) {
      setError(FIELD_ERROR.empty);
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

const quietButtonClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60';

function resolveMonth(month: string, today: Date): string {
  if (planMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
}

function FullscreenToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
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
