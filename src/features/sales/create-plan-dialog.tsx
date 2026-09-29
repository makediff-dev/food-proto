"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

import {
  activeFinalProducts,
  availablePlanMonths,
  daysInMonth,
  hasEarlierPlanPrice,
  suggestedPriceWithVatKopecks,
} from "@/domain/sales-plan";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { materialListHref } from "@/features/materials/paths";
import { planHref } from "@/features/sales/paths";
import { daysPhrase, formatMonth, SALES_PLAN_ERROR } from "@/features/sales/text";
import { useSales } from "@/features/sales/use-sales";
import { Dialog } from "@/features/shell/dialog";
import { IconPlus } from "@/features/shell/icons";

export function CreatePlanDialog({ onClose }: { onClose: () => void }) {
  const sales = useSales();
  const router = useRouter();
  const monthId = useId();
  const today = useMemo(() => new Date(), []);
  const products = activeFinalProducts(sales.document);
  const months = availablePlanMonths(sales.document, today);
  const [month, setMonth] = useState(months[0] ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [planId] = useState(() => `sales-plan:${crypto.randomUUID()}`);

  function submit() {
    if (pending || !month) {
      return;
    }

    const lines = products.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
      priceWithVatKopecks: suggestedPriceWithVatKopecks(
        sales.document,
        product.id,
        month,
      ),
      volumePieces: 0,
    }));
    const rejection = sales.addPlan(planId, month, lines);
    if (rejection) {
      setError(SALES_PLAN_ERROR[rejection]);
      return;
    }

    setPending(true);
    router.push(planHref(planId));
  }

  return (
    <Dialog title="Новый план" onClose={onClose}>
      {products.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-ink">
            Сначала добавьте товар. План строится по рабочим конечным товарам.
          </p>
          <Link
            href={materialListHref("products", false)}
            className={primaryButtonClassName}
          >
            К товарам
          </Link>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div>
            <label htmlFor={monthId} className="text-sm text-muted">
              Месяц
            </label>
            <select
              id={monthId}
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setError(null);
              }}
              className={`mt-1.5 ${fieldClassName}`}
            >
              {months.map((item) => (
                <option key={item} value={item}>
                  {formatMonth(item)} · {daysPhrase(daysInMonth(item))}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm leading-6 text-muted">
            {month && hasEarlierPlanPrice(sales.document, month)
              ? "Цены с НДС подставятся из последнего более раннего плана, где товар уже был. Объём будет 0."
              : "Цен с прошлых планов нет: у каждого товара будет 0. Объём тоже 0."}
          </p>
          {error ? <p className="text-sm text-ink">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || !month}
            className={`w-full sm:w-auto ${primaryButtonClassName}`}
          >
            <IconPlus />
            Создать план
          </button>
        </form>
      )}
    </Dialog>
  );
}
