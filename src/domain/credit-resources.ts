import { rejectName } from '@/domain/directory';
import {
  type Creditor,
  type CreditResourceMonth,
  type CreditResourceMonthLine,
  isDeletionMark,
  isMonthKey,
  type PrototypeDocument,
} from '@/domain/document';

const MAX_MONEY = 100_000_000_000;
const MAX_NAME = 120;
const MAX_RATE_HUNDREDTHS = 100_000; // 1000 %
const CHAIN_START = '2000-01';

export type CreditFieldRejection =
  | 'missing'
  | 'month'
  | 'name'
  | 'empty'
  | 'too-long'
  | 'duplicate'
  | 'amount'
  | 'rate'
  | 'archived';

export type CreditMonthField =
  | 'planReceived'
  | 'factReceived'
  | 'planRepaid'
  | 'factRepaid'
  | 'planInterest'
  | 'factInterest';

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

export function activeCreditors(document: PrototypeDocument): Creditor[] {
  return creditorsList(document).filter((item) => item.deletedAt === null);
}

function findCreditor(document: PrototypeDocument, creditorId: string): Creditor | null {
  return creditorsList(document).find((item) => item.id === creditorId) ?? null;
}

function monthRecord(document: PrototypeDocument, month: string): CreditResourceMonth | null {
  return creditResourceMonthsList(document).find((item) => item.month === month) ?? null;
}

function storedLine(document: PrototypeDocument, month: string, creditorId: string): CreditResourceMonthLine | null {
  return monthRecord(document, month)?.lines.find((item) => item.creditorId === creditorId) ?? null;
}

function emptyLine(creditorId: string, month: string): CreditResourceMonthLine {
  return {
    id: `credit-line:${month}:${creditorId}`,
    creditorId,
    planReceived: 0,
    factReceived: 0,
    planRepaid: 0,
    factRepaid: 0,
    planInterest: 0,
    factInterest: 0,
  };
}

function lineAmounts(line: CreditResourceMonthLine | null): Omit<CreditResourceMonthLine, 'id' | 'creditorId'> {
  return {
    planReceived: line?.planReceived ?? 0,
    factReceived: line?.factReceived ?? 0,
    planRepaid: line?.planRepaid ?? 0,
    factRepaid: line?.factRepaid ?? 0,
    planInterest: line?.planInterest ?? 0,
    factInterest: line?.factInterest ?? 0,
  };
}

/**
 * Остаток тела на начало месяца: стартовая сумма + цепочка факта до предыдущего месяца.
 * `opening = initial + Σ(factReceived − factRepaid)` по месяцам с записями до `month`.
 */
export function openingPrincipal(document: PrototypeDocument, creditor: Creditor, month: string): number {
  let balance = creditor.initialPrincipal;
  for (const record of creditResourceMonthsList(document)) {
    if (record.month >= month || record.month < CHAIN_START) {
      continue;
    }
    const line = record.lines.find((item) => item.creditorId === creditor.id);
    if (!line) {
      continue;
    }
    balance += line.factReceived - line.factRepaid;
  }
  return balance;
}

function lineHasActivity(amounts: Omit<CreditResourceMonthLine, 'id' | 'creditorId'>): boolean {
  return (
    amounts.planReceived !== 0 ||
    amounts.factReceived !== 0 ||
    amounts.planRepaid !== 0 ||
    amounts.factRepaid !== 0 ||
    amounts.planInterest !== 0 ||
    amounts.factInterest !== 0
  );
}

function gridCreditors(document: PrototypeDocument, month: string): Creditor[] {
  const all = creditorsList(document);
  const active = all.filter((item) => item.deletedAt === null);
  const activeIds = new Set(active.map((item) => item.id));
  const archived = all.filter((item) => {
    if (item.deletedAt === null || activeIds.has(item.id)) {
      return false;
    }
    const opening = openingPrincipal(document, item, month);
    const amounts = lineAmounts(storedLine(document, month, item.id));
    return opening !== 0 || lineHasActivity(amounts);
  });
  return [...active, ...archived].sort((left, right) => left.name.localeCompare(right.name, 'ru'));
}

function rowView(document: PrototypeDocument, month: string, creditor: Creditor): CreditCreditorRowView {
  const amounts = lineAmounts(storedLine(document, month, creditor.id));
  const opening = openingPrincipal(document, creditor, month);
  const planClosing = opening + amounts.planReceived - amounts.planRepaid;
  const factClosing = opening + amounts.factReceived - amounts.factRepaid;
  return {
    creditorId: creditor.id,
    name: creditor.name,
    deleted: creditor.deletedAt !== null,
    initialPrincipal: creditor.initialPrincipal,
    interestRateHundredths: creditor.interestRateHundredths,
    openingPrincipal: opening,
    planReceived: amounts.planReceived,
    factReceived: amounts.factReceived,
    varianceReceived: amounts.factReceived - amounts.planReceived,
    planRepaid: amounts.planRepaid,
    factRepaid: amounts.factRepaid,
    varianceRepaid: amounts.factRepaid - amounts.planRepaid,
    planClosingPrincipal: planClosing,
    factClosingPrincipal: factClosing,
    varianceClosingPrincipal: factClosing - planClosing,
    planInterest: amounts.planInterest,
    factInterest: amounts.factInterest,
    varianceInterest: amounts.factInterest - amounts.planInterest,
  };
}

/** Сетка месяца: кредиторы, остатки тела, получение, погашение и проценты. */
export function creditResourcesMonthView(document: PrototypeDocument, month: string): CreditResourcesMonthView {
  const rows = gridCreditors(document, month).map((creditor) => rowView(document, month, creditor));
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
  const current = storedLine(document, month, creditorId) ?? emptyLine(creditorId, month);
  const nextLine: CreditResourceMonthLine = { ...current, [field]: amount };
  const amounts = lineAmounts(nextLine);
  const keep = lineHasActivity(amounts);

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

export function setInitialCashBalanceRejection(amount: number): CreditFieldRejection | null {
  if (!isMoney(amount)) {
    return 'amount';
  }
  return null;
}

export function setInitialCashBalance(document: PrototypeDocument, amount: number): PrototypeDocument {
  if (setInitialCashBalanceRejection(amount)) {
    return document;
  }
  return { ...document, initialCashBalance: amount };
}

export function initialCashBalance(document: PrototypeDocument): number {
  return document.initialCashBalance ?? 0;
}
