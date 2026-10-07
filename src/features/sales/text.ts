import { MAX_OPERATING_EXPENSE, MAX_VOLUME_PIECES } from '@/domain/document';
import type { SalesPlanRejection } from '@/domain/sales-plan';
import type { OperatingExpenseRejection } from '@/domain/summary';
import { parseDecimal } from '@/domain/units';
import { parseMoney } from '@/features/sales/fields';

export const SALES_PLAN_ERROR: Record<SalesPlanRejection, string> = {
  missing: 'Запись не найдена.',
  month: 'Этот месяц выбрать нельзя.',
  taken: 'На этот месяц уже есть рабочий план.',
  products: 'В плане должны быть все рабочие товары.',
  price: 'Укажите цену.',
  volume: 'Укажите объём целым числом штук.',
  overflow: 'Такие цена и объём не помещаются в расчёт.',
  'duplicate-line': 'Этот товар уже есть в плане.',
  locked: 'Удалённый товар в плане не меняется.',
  closed: 'Этот план сейчас нельзя править.',
};

export const OPERATING_EXPENSE_ERROR: Record<
  OperatingExpenseRejection,
  string
> = {
  month: 'Этот месяц выбрать нельзя.',
  amount: 'Укажите сумму операционных расходов без НДС.',
};

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

export function formatMonthName(month: string): string {
  const mon = Number(month.slice(5, 7));
  return MONTHS[mon - 1] ?? month;
}

/** Родительный падеж: «за 7 дней октября». */
export function formatMonthNameGenitive(month: string): string {
  const mon = Number(month.slice(5, 7));
  return MONTHS_GENITIVE[mon - 1] ?? month;
}

export function formatMonth(month: string): string {
  const year = Number(month.slice(0, 4));
  const name = formatMonthName(month);
  return name === month ? month : `${name} ${year}`;
}

// Не вызывается: год месяца на сводке больше не подписывают отдельно.
// export function monthYear(month: string): string {
//   return month.slice(0, 4);
// }
//
// export function phaseLabel(phase: PlanPhase): string {
//   if (phase === 'current') {
//     return 'текущий';
//   }
//   if (phase === 'future') {
//     return 'будущий';
//   }
//
//   return 'прошедший';
// }

export function daysPhrase(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'день'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'дня'
        : 'дней';
  return `${count} ${word}`;
}

export function formatPieces(value: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function formatPerDay(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(value);
}

/** Десятитысячные доли рубля на экране — до копеек. */
export function formatPriceExVat(tenThousandths: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(tenThousandths / 10_000);
}

export function formatPercentHundredths(hundredths: number): string {
  return `${new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(hundredths / 100)} %`;
}

// Не вызывается: сводка рисует пару с НДС / без НДС в двух строках клетки.
// export function formatMoneyPair(
//   withVat: number,
//   exVat: number,
// ): string {
//   return `${formatMoney(withVat)} с НДС · ${formatMoney(exVat)} без НДС`;
// }
//
// export function formatContribution(amount: number): string {
//   return formatMoney(amount);
// }

export function parseVolumePieces(raw: string): number | null {
  const value = parseDecimal(raw);
  if (
    value === null ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > MAX_VOLUME_PIECES
  ) {
    return null;
  }

  return value;
}

export function parsePlanPrice(raw: string): number | null {
  return parseMoney(raw);
}

/** Операционные расходы свода: рубли → копейки, ноль допустим. */
export function parseOperatingExpense(raw: string): number | null {
  const rubles = parseDecimal(raw);
  if (rubles === null) {
    return null;
  }

  const amount = Math.round(rubles * 100);
  if (
    !Number.isInteger(amount) ||
    amount < 0 ||
    amount > MAX_OPERATING_EXPENSE
  ) {
    return null;
  }

  return amount;
}

export function priceDraft(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function volumeDraft(pieces: number): string {
  return String(pieces);
}

// Не вызывается: счётчик товаров с объёмом на сводке больше не показывают.
// export function productCountPhrase(withVolume: number, total: number): string {
//   return `${formatPieces(withVolume)} из ${formatPieces(total)} с объёмом`;
// }
