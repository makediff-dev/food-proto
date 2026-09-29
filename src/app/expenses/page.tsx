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
      lede="Сумма, которая вычитается из суммарного Т-протока и не зависит от объёма продаж."
      note="Здесь появятся операционные расходы с НДС и без НДС."
    />
  );
}
