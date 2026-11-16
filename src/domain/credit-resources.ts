import { rejectName } from '@/domain/directory';
import {
  type Creditor,
  type CreditResourceDay,
  type CreditResourceDayLine,
  type CreditResourceMonth,
  type CreditResourceMonthLine,
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  type PrototypeDocument,
} from '@/domain/document';

const MAX_MONEY = 100_000_000_000;
const MAX_NAME = 120;
const MAX_RATE_HUNDREDTHS = 100_000; // 1000 %
const CHAIN_START = '2000-01';

export type CreditFieldRejection =
  | 'missing'
  | 'month'
  | 'day'
  | 'name'
  | 'empty'
  | 'too-long'
  | 'duplicate'
  | 'amount'
  | 'rate'
  | 'archived';

export type CreditMonthField = 'planReceived' | 'planRepaid' | 'planInterest';

export type CreditDayField = 'received' | 'repaid' | 'interest';

export interface CreditCreditorRowView {
  creditorId: string;
  name: string;
  deleted: boolean;
  /** Стартовая сумма кредита, копейки. */
  initialPrincipal: number;
  /** Ставка, сотые доли процента. */
  interestRateHundredths: number;
  openingPrincipal: number;
  planReceived: number;
  factReceived: number;
  varianceReceived: number;
  planRepaid: number;
  factRepaid: number;
  varianceRepaid: number;
  planClosingPrincipal: number;
  factClosingPrincipal: number;
  varianceClosingPrincipal: number;
  planInterest: number;
  factInterest: number;
  varianceInterest: number;
}

export interface CreditResourcesMonthView {
  month: string;
  rows: CreditCreditorRowView[];
  total: {
    initialPrincipal: number;
    openingPrincipal: number;
    planReceived: number;
    factReceived: number;
    varianceReceived: number;
    planRepaid: number;
    factRepaid: number;
    varianceRepaid: number;
    planClosingPrincipal: number;
    factClosingPrincipal: number;
    varianceClosingPrincipal: number;
    planInterest: number;
    factInterest: number;
    varianceInterest: number;
  };
}

function isMoney(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;
}

function isRate(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_RATE_HUNDREDTHS;
}

export function creditorsList(document: PrototypeDocument): Creditor[] {
  return document.creditors ?? [];
}

export function creditResourceMonthsList(document: PrototypeDocument): CreditResourceMonth[] {
  return document.creditResourceMonths ?? [];
}

export function creditResourceDaysList(document: PrototypeDocument): CreditResourceDay[] {
  return document.creditResourceDays ?? [];
}

export function activeCreditors(document: PrototypeDocument): Creditor[] {
  return creditorsList(document).filter((item) => item.deletedAt === null);
}

function findCreditor(document: PrototypeDocument, creditorId: string): Creditor | null {
  return creditorsList(document).find((item) => item.id === creditorId) ?? null;
}

function monthRecord(document: PrototypeDocument, month: string): CreditResourceMonth | null {
  return creditResourceMonthsList(document).find((item) => item.month === month) ?? null;
}

function dayRecord(document: PrototypeDocument, occurredOn: string): CreditResourceDay | null {
  return creditResourceDaysList(document).find((item) => item.occurredOn === occurredOn) ?? null;
}

function storedMonthLine(
  document: PrototypeDocument,
  month: string,
  creditorId: string,
): CreditResourceMonthLine | null {
  return monthRecord(document, month)?.lines.find((item) => item.creditorId === creditorId) ?? null;
}

function storedDayLine(
  document: PrototypeDocument,
  occurredOn: string,
  creditorId: string,
): CreditResourceDayLine | null {
  return dayRecord(document, occurredOn)?.lines.find((item) => item.creditorId === creditorId) ?? null;
}

function emptyMonthLine(creditorId: string, month: string): CreditResourceMonthLine {
  return {
    id: `credit-line:${month}:${creditorId}`,
    creditorId,
    planReceived: 0,
    planRepaid: 0,
    planInterest: 0,
  };
}

function emptyDayLine(creditorId: string, occurredOn: string): CreditResourceDayLine {
  return {
    id: `credit-day-line:${occurredOn}:${creditorId}`,
    creditorId,
    received: 0,
    repaid: 0,
    interest: 0,
  };
}

function planAmounts(
  line: CreditResourceMonthLine | null,
): Pick<CreditResourceMonthLine, 'planReceived' | 'planRepaid' | 'planInterest'> {
  return {
    planReceived: line?.planReceived ?? 0,
    planRepaid: line?.planRepaid ?? 0,
    planInterest: line?.planInterest ?? 0,
  };
}

function dayAmounts(
  line: CreditResourceDayLine | null,
): Pick<CreditResourceDayLine, 'received' | 'repaid' | 'interest'> {
  return {
    received: line?.received ?? 0,
    repaid: line?.repaid ?? 0,
    interest: line?.interest ?? 0,
  };
}

function monthFactAmounts(
  document: PrototypeDocument,
  month: string,
  creditorId: string,
): { factReceived: number; factRepaid: number; factInterest: number } {
  let factReceived = 0;
  let factRepaid = 0;
  let factInterest = 0;
  for (const day of creditResourceDaysList(document)) {
    if (!day.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    const line = day.lines.find((item) => item.creditorId === creditorId);
    if (!line) {
      continue;
    }
    factReceived += line.received;
    factRepaid += line.repaid;
    factInterest += line.interest;
  }
  return { factReceived, factRepaid, factInterest };
}

/**
 * Остаток тела на начало месяца: только цепочка факта получения − погашения до месяца.
 * Справочная «сумма кредита» (`initialPrincipal`) в остаток не входит — кредит появляется
 * с месяца получения (или иного движения).
 */
export function openingPrincipal(document: PrototypeDocument, creditor: Creditor, month: string): number {
  let balance = 0;
  for (const day of creditResourceDaysList(document)) {
    const dayMonth = day.occurredOn.slice(0, 7);
    if (dayMonth >= month || dayMonth < CHAIN_START) {
      continue;
    }
    const line = day.lines.find((item) => item.creditorId === creditor.id);
    if (!line) {
      continue;
    }
    balance += line.received - line.repaid;
  }
  return balance;
}

function planHasActivity(
  amounts: Pick<CreditResourceMonthLine, 'planReceived' | 'planRepaid' | 'planInterest'>,
): boolean {
  return amounts.planReceived !== 0 || amounts.planRepaid !== 0 || amounts.planInterest !== 0;
}

function dayHasActivity(amounts: Pick<CreditResourceDayLine, 'received' | 'repaid' | 'interest'>): boolean {
  return amounts.received !== 0 || amounts.repaid !== 0 || amounts.interest !== 0;
}

function creditorVisibleInMonth(document: PrototypeDocument, creditor: Creditor, month: string): boolean {
  const opening = openingPrincipal(document, creditor, month);
  const plan = planAmounts(storedMonthLine(document, month, creditor.id));
  const fact = monthFactAmounts(document, month, creditor.id);
  return (
    opening !== 0 ||
    planHasActivity(plan) ||
    fact.factReceived !== 0 ||
    fact.factRepaid !== 0 ||
    fact.factInterest !== 0
  );
}

export type CreditMonthViewOptions = {
  /**
   * Показывать рабочих кредиторов без остатка и движения и всех архивных.
   * Нужно на вводе плана (первое получение и возврат) и на вводе факта.
   * В отчётах и ДДС — `false`: строка с месяца взятия / с движением.
   */
  includeIdleActive?: boolean;
};

function gridCreditors(document: PrototypeDocument, month: string, options?: CreditMonthViewOptions): Creditor[] {
  const includeIdleActive = options?.includeIdleActive === true;
  const all = creditorsList(document);
  const active = all.filter((item) => {
    if (item.deletedAt !== null) {
      return false;
    }
    return includeIdleActive || creditorVisibleInMonth(document, item, month);
  });
  const activeIds = new Set(active.map((item) => item.id));
  const archived = all.filter((item) => {
    if (item.deletedAt === null || activeIds.has(item.id)) {
      return false;
    }
    return includeIdleActive || creditorVisibleInMonth(document, item, month);
  });
  return [...active, ...archived].sort((left, right) => left.name.localeCompare(right.name, 'ru'));
}

function rowView(document: PrototypeDocument, month: string, creditor: Creditor): CreditCreditorRowView {
  const plan = planAmounts(storedMonthLine(document, month, creditor.id));
  const fact = monthFactAmounts(document, month, creditor.id);
  const opening = openingPrincipal(document, creditor, month);
  const planClosing = opening + plan.planReceived - plan.planRepaid;
  const factClosing = opening + fact.factReceived - fact.factRepaid;
  return {
    creditorId: creditor.id,
    name: creditor.name,
    deleted: creditor.deletedAt !== null,
    initialPrincipal: creditor.initialPrincipal,
    interestRateHundredths: creditor.interestRateHundredths,
    openingPrincipal: opening,
    planReceived: plan.planReceived,
    factReceived: fact.factReceived,
    varianceReceived: fact.factReceived - plan.planReceived,
    planRepaid: plan.planRepaid,
    factRepaid: fact.factRepaid,
    varianceRepaid: fact.factRepaid - plan.planRepaid,
    planClosingPrincipal: planClosing,
    factClosingPrincipal: factClosing,
    varianceClosingPrincipal: factClosing - planClosing,
    planInterest: plan.planInterest,
    factInterest: fact.factInterest,
    varianceInterest: fact.factInterest - plan.planInterest,
  };
}

/** Сетка месяца: кредиторы, остатки тела, получение, погашение и проценты. */
export function creditResourcesMonthView(
  document: PrototypeDocument,
  month: string,
  options?: CreditMonthViewOptions,
): CreditResourcesMonthView {
  const rows = gridCreditors(document, month, options).map((creditor) => rowView(document, month, creditor));
  const sum = (pick: (row: CreditCreditorRowView) => number) => rows.reduce((total, row) => total + pick(row), 0);
  return {
    month,
    rows,
    total: {
      initialPrincipal: sum((row) => row.initialPrincipal),
      openingPrincipal: sum((row) => row.openingPrincipal),
      planReceived: sum((row) => row.planReceived),
      factReceived: sum((row) => row.factReceived),
      varianceReceived: sum((row) => row.varianceReceived),
      planRepaid: sum((row) => row.planRepaid),
      factRepaid: sum((row) => row.factRepaid),
      varianceRepaid: sum((row) => row.varianceRepaid),
      planClosingPrincipal: sum((row) => row.planClosingPrincipal),
      factClosingPrincipal: sum((row) => row.factClosingPrincipal),
      varianceClosingPrincipal: sum((row) => row.varianceClosingPrincipal),
      planInterest: sum((row) => row.planInterest),
      factInterest: sum((row) => row.factInterest),
      varianceInterest: sum((row) => row.varianceInterest),
    },
  };
}

/** Суммы факта кредитора на день (для экрана ввода факта). */
export function creditDayAmounts(
  document: PrototypeDocument,
  occurredOn: string,
  creditorId: string,
): { received: number; repaid: number; interest: number } {
  return dayAmounts(storedDayLine(document, occurredOn, creditorId));
}

/** Сумма процентных платежей месяца для свода продаж и ДДС. */
export function monthInterestAmounts(document: PrototypeDocument, month: string): { plan: number; fact: number } {
  const view = creditResourcesMonthView(document, month);
  return { plan: view.total.planInterest, fact: view.total.factInterest };
}

export function addCreditorRejection(document: PrototypeDocument, name: string): CreditFieldRejection | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'empty';
  }
  if (trimmed.length > MAX_NAME) {
    return 'too-long';
  }
  return rejectName(trimmed, creditorsList(document));
}

export function addCreditor(
  document: PrototypeDocument,
  creditor: Omit<Creditor, 'deletedAt' | 'name' | 'initialPrincipal' | 'interestRateHundredths'> & {
    name: string;
    initialPrincipal?: number;
    interestRateHundredths?: number;
  },
): PrototypeDocument {
  if (addCreditorRejection(document, creditor.name)) {
    return document;
  }
  const next: Creditor = {
    id: creditor.id,
    name: creditor.name.trim(),
    initialPrincipal: creditor.initialPrincipal ?? 0,
    interestRateHundredths: creditor.interestRateHundredths ?? 0,
    deletedAt: null,
  };
  return {
    ...document,
    creditors: [...creditorsList(document), next],
  };
}

export function renameCreditorRejection(
  document: PrototypeDocument,
  creditorId: string,
  name: string,
): CreditFieldRejection | null {
  const creditor = findCreditor(document, creditorId);
  if (!creditor || creditor.deletedAt !== null) {
    return 'missing';
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'empty';
  }
  if (trimmed.length > MAX_NAME) {
    return 'too-long';
  }
  return rejectName(trimmed, creditorsList(document), creditorId);
}

export function renameCreditor(document: PrototypeDocument, creditorId: string, name: string): PrototypeDocument {
  if (renameCreditorRejection(document, creditorId, name)) {
    return document;
  }
  const trimmed = name.trim();
  return {
    ...document,
    creditors: creditorsList(document).map((item) => (item.id === creditorId ? { ...item, name: trimmed } : item)),
  };
}

export function deleteCreditor(document: PrototypeDocument, creditorId: string, deletedAt: string): PrototypeDocument {
  const creditor = findCreditor(document, creditorId);
  if (!creditor || creditor.deletedAt !== null || !isDeletionMark(deletedAt)) {
    return document;
  }
  return {
    ...document,
    creditors: creditorsList(document).map((item) => (item.id === creditorId ? { ...item, deletedAt } : item)),
  };
}

export function restoreCreditorRejection(document: PrototypeDocument, creditorId: string): CreditFieldRejection | null {
  const creditor = findCreditor(document, creditorId);
  if (!creditor || creditor.deletedAt === null) {
    return 'missing';
  }
  return rejectName(creditor.name, creditorsList(document), creditorId);
}

export function restoreCreditor(document: PrototypeDocument, creditorId: string): PrototypeDocument {
  if (restoreCreditorRejection(document, creditorId)) {
    return document;
  }
  return {
    ...document,
    creditors: creditorsList(document).map((item) => (item.id === creditorId ? { ...item, deletedAt: null } : item)),
  };
}

export function setCreditorInitialPrincipalRejection(
  document: PrototypeDocument,
  creditorId: string,
  amount: number,
): CreditFieldRejection | null {
  const creditor = findCreditor(document, creditorId);
  if (!creditor || creditor.deletedAt !== null) {
    return 'missing';
  }
  if (!isMoney(amount)) {
    return 'amount';
  }
  return null;
}

export function setCreditorInitialPrincipal(
  document: PrototypeDocument,
  creditorId: string,
  amount: number,
): PrototypeDocument {
  if (setCreditorInitialPrincipalRejection(document, creditorId, amount)) {
    return document;
  }
  return {
    ...document,
    creditors: creditorsList(document).map((item) =>
      item.id === creditorId ? { ...item, initialPrincipal: amount } : item,
    ),
  };
}

export function setCreditorInterestRateRejection(
  document: PrototypeDocument,
  creditorId: string,
  rateHundredths: number,
): CreditFieldRejection | null {
  const creditor = findCreditor(document, creditorId);
  if (!creditor || creditor.deletedAt !== null) {
    return 'missing';
  }
  if (!isRate(rateHundredths)) {
    return 'rate';
  }
  return null;
}

export function setCreditorInterestRate(
  document: PrototypeDocument,
  creditorId: string,
  rateHundredths: number,
): PrototypeDocument {
  if (setCreditorInterestRateRejection(document, creditorId, rateHundredths)) {
    return document;
  }
  return {
    ...document,
    creditors: creditorsList(document).map((item) =>
      item.id === creditorId ? { ...item, interestRateHundredths: rateHundredths } : item,
    ),
  };
}

export function setCreditMonthFieldRejection(
  document: PrototypeDocument,
  month: string,
  creditorId: string,
  field: CreditMonthField,
  amount: number,
): CreditFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const creditor = findCreditor(document, creditorId);
  if (!creditor) {
    return 'missing';
  }
  if (creditor.deletedAt !== null) {
    return 'archived';
  }
  if (!isMoney(amount)) {
    return 'amount';
  }
  void field;
  return null;
}

export function setCreditMonthField(
  document: PrototypeDocument,
  month: string,
  creditorId: string,
  field: CreditMonthField,
  amount: number,
): PrototypeDocument {
  if (setCreditMonthFieldRejection(document, month, creditorId, field, amount)) {
    return document;
  }

  const existing = monthRecord(document, month);
  const current = storedMonthLine(document, month, creditorId) ?? emptyMonthLine(creditorId, month);
  const nextLine: CreditResourceMonthLine = { ...current, [field]: amount };
  const amounts = planAmounts(nextLine);
  const keep = planHasActivity(amounts);

  if (!existing) {
    if (!keep) {
      return document;
    }
    return {
      ...document,
      creditResourceMonths: [
        ...creditResourceMonthsList(document),
        { id: `credit-month:${month}`, month, lines: [nextLine] },
      ],
    };
  }

  const without = existing.lines.filter((item) => item.creditorId !== creditorId);
  const lines = keep ? [...without, nextLine] : without;
  if (lines.length === 0) {
    return {
      ...document,
      creditResourceMonths: creditResourceMonthsList(document).filter((item) => item.month !== month),
    };
  }
  return {
    ...document,
    creditResourceMonths: creditResourceMonthsList(document).map((item) =>
      item.month === month ? { ...item, lines } : item,
    ),
  };
}

export function setCreditDayFieldRejection(
  document: PrototypeDocument,
  occurredOn: string,
  creditorId: string,
  field: CreditDayField,
  amount: number,
): CreditFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  const creditor = findCreditor(document, creditorId);
  if (!creditor) {
    return 'missing';
  }
  if (creditor.deletedAt !== null) {
    return 'archived';
  }
  if (!isMoney(amount)) {
    return 'amount';
  }
  void field;
  return null;
}

export function setCreditDayField(
  document: PrototypeDocument,
  occurredOn: string,
  creditorId: string,
  field: CreditDayField,
  amount: number,
): PrototypeDocument {
  if (setCreditDayFieldRejection(document, occurredOn, creditorId, field, amount)) {
    return document;
  }

  const existing = dayRecord(document, occurredOn);
  const current = storedDayLine(document, occurredOn, creditorId) ?? emptyDayLine(creditorId, occurredOn);
  const nextLine: CreditResourceDayLine = { ...current, [field]: amount };
  const amounts = dayAmounts(nextLine);
  const keep = dayHasActivity(amounts);

  if (!existing) {
    if (!keep) {
      return document;
    }
    return {
      ...document,
      creditResourceDays: [
        ...creditResourceDaysList(document),
        { id: `credit-day:${occurredOn}`, occurredOn, lines: [nextLine] },
      ],
    };
  }

  const without = existing.lines.filter((item) => item.creditorId !== creditorId);
  const lines = keep ? [...without, nextLine] : without;
  if (lines.length === 0) {
    return {
      ...document,
      creditResourceDays: creditResourceDaysList(document).filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    creditResourceDays: creditResourceDaysList(document).map((item) =>
      item.occurredOn === occurredOn ? { ...item, lines } : item,
    ),
  };
}
