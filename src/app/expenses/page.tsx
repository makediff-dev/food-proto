import type { Metadata } from "next";

import { PendingSection } from "@/features/shell/page-frame";

const TITLE = "Операционные расходы";

export const metadata: Metadata = {
  title: TITLE,
};

export default function OperatingExpensesPage() {
  return (
    <PendingSection
      title={TITLE}
      lede="Статьи расходов по листу Operation Expense. Итоговая сумма уже вычитается из Т-протока на «Сводке»."
      note="Здесь появятся статьи с НДС и без НДС. Пока сумму плана и факта можно задать на «Сводке»."
    />
  );
}
