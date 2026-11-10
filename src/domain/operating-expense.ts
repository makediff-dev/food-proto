import { type NameRejection, rejectName } from '@/domain/directory';
import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  isOpexGroupCode,
  type OpexDayFact,
  type OpexDayLine,
  type OpexGroupCode,
  type OpexMonthLine,
  type OpexMonthLines,
  type OpexOtherLine,
  type PrototypeDocument,
} from '@/domain/document';
import { hrMonthView } from '@/domain/hr';
import { ratioRound } from '@/domain/money';
import { transportMonthView } from '@/domain/transport';

const MAX_MONEY = 100_000_000_000;
const MAX_NAME = 120;

/** Доля агентского соглашения от выручки с НДС. `Operation Expense!E41 = Svod!G2*0.07`. */
export const AGENCY_FEE_PERCENT = 7;

export type OpexFieldRejection =
  | 'missing'
  | 'month'
  | 'day'
  | 'daily'
  | 'amount'
  | 'line'
  | 'group'
  | 'archived'
  | 'promoted'
  | 'not-promoted'
  | 'not-promotable'
  | NameRejection;

export type OpexRowKind = 'derived' | 'editable';

export interface OpexLineView {
  id: string;
  kind: OpexRowKind;
  /** Номер/код как в книге: «1.1», «2». */
  code: string;
  name: string;
  deleted: boolean;
  planExVat: number;
  factExVat: number;
  varianceExVat: number;
  planShareHundredths: number;
  factShareHundredths: number;
}

export interface OpexGroupView {
  id: string;
  code: OpexGroupCode;
  name: string;
  planExVat: number;
  factExVat: number;
  varianceExVat: number;
  planShareHundredths: number;
  factShareHundredths: number;
  lines: OpexLineView[];
}

export interface OpexMonthView {
  month: string;
  groups: OpexGroupView[];
  totalPlanExVat: number;
  totalFactExVat: number;
  totalVarianceExVat: number;
}

export type OpexOtherRowKind = 'derived' | OpexOtherLine['kind'];

export interface OpexOtherLineView {
  id: string;
  code: string;
  name: string;
  kind: OpexOtherRowKind;
  deleted: boolean;
  planExVat: number;
  factExVat: number;
  varianceExVat: number;
  planEditable: boolean;
  factEditable: boolean;
}

export interface OpexOtherGroupView {
  code: OpexGroupCode;
  /**
   * Номер на экране: порядковый среди категорий «Прочего» (после поднятий),
   * пустая строка на странице поднятой категории.
   */
  displayCode: string;
  name: string;
  lines: OpexOtherLineView[];
  totalPlanExVat: number;
  totalFactExVat: number;
  totalVarianceExVat: number;
}

/** Как нумеровать группу и статьи на экране «Прочее» / поднятой категории. */
type OtherNumbering = { mode: 'display'; ordinal: number } | { mode: 'standalone' };

export interface OpexOtherMonthView {
  month: string;
  groups: OpexOtherGroupView[];
  totalPlanExVat: number;
  totalFactExVat: number;
  totalVarianceExVat: number;
}

interface DerivedDef {
  id: string;
  code: string;
  name: string;
  source: 'hr-payroll' | 'hr-tax' | 'hr-outsourcing' | 'transport-hire' | 'transport-fuel';
}

interface GroupDef {
  code: OpexGroupCode;
  name: string;
  derived: readonly DerivedDef[];
}

const GROUPS: readonly GroupDef[] = [
  {
    code: '1',
    name: 'Фонд оплаты персонала',
    derived: [
      { id: 'payroll', code: '1.1', name: 'Зарплата на руки штатным сотрудникам', source: 'hr-payroll' },
      { id: 'payrollTax', code: '1.2', name: 'Налоги от зарплаты', source: 'hr-tax' },
      { id: 'outsourcing', code: '1.3', name: 'Аутсорсинг персонала', source: 'hr-outsourcing' },
    ],
  },
  {
    code: '2',
    name: 'Базовые ресурсы',
    derived: [],
  },
  {
    code: '3',
    name: 'Связь и коммуникации',
    derived: [],
  },
  {
    code: '4',
    name: 'Общепроизводственные расходы',
    derived: [],
  },
  {
    code: '5',
    name: 'Общехозяйственные расходы',
    derived: [],
  },
  {
    code: '6',
    name: 'Коммерческие расходы',
    derived: [],
  },
  {
    code: '7',
    name: 'Транспортные расходы',
    derived: [
      { id: 'hireTransport', code: '7.1', name: 'Наемный транспорт', source: 'transport-hire' },
      { id: 'ownFuel', code: '7.2', name: 'Топливо для собственного транспорта', source: 'transport-fuel' },
    ],
  },
  {
    code: '8',
    name: 'Ремонт и содержание оборудования',
    derived: [],
  },
];

export const OPEX_GROUP_LABELS: Record<OpexGroupCode, string> = Object.fromEntries(
  GROUPS.map((group) => [group.code, group.name]),
) as Record<OpexGroupCode, string>;

/** Группы без строк HR/транспорта — их можно вынести из «Прочего» в отдельный раздел. */
export const PROMOTABLE_OPEX_GROUP_CODES = ['2', '3', '4', '5', '6', '8'] as const satisfies readonly OpexGroupCode[];

export type PromotableOpexGroupCode = (typeof PROMOTABLE_OPEX_GROUP_CODES)[number];

export function isPromotableOpexGroupCode(value: string): value is PromotableOpexGroupCode {
  return (PROMOTABLE_OPEX_GROUP_CODES as readonly string[]).includes(value);
}

export function opexGroupName(code: OpexGroupCode): string {
  return OPEX_GROUP_LABELS[code];
}

function groupDef(code: OpexGroupCode): GroupDef {
  const group = GROUPS.find((item) => item.code === code);
  if (!group) {
    throw new Error(`Unknown opex group ${code}`);
  }
  return group;
}

function promotedSet(document: PrototypeDocument): Set<OpexGroupCode> {
  return new Set(document.opexPromotedGroupCodes);
}

function isMoney(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;
}

function shareHundredths(amountExVat: number, revenueExVat: number): number {
  if (revenueExVat === 0) {
    return 0;
  }
  return ratioRound(amountExVat * 10_000, revenueExVat) ?? 0;
}

function opexLines(document: PrototypeDocument, month: string): OpexMonthLines | null {
  return document.opexMonthLines.find((item) => item.month === month) ?? null;
}

function storedLine(lines: OpexMonthLines | null, lineId: string): OpexMonthLine | null {
  return lines?.lines.find((item) => item.lineId === lineId) ?? null;
}

function agencyPlanExVat(revenueWithVat: number): number {
  return ratioRound(revenueWithVat * AGENCY_FEE_PERCENT, 100) ?? 0;
}

function activeOtherLines(document: PrototypeDocument): OpexOtherLine[] {
  return document.opexOtherLines.filter((item) => item.deletedAt === null);
}

function otherLinesForGroup(document: PrototypeDocument, groupCode: OpexGroupCode): OpexOtherLine[] {
  return activeOtherLines(document).filter((item) => item.groupCode === groupCode);
}

function displayGroupCode(numbering: OtherNumbering): string {
  switch (numbering.mode) {
    case 'display':
      return String(numbering.ordinal);
    case 'standalone':
      return '';
  }
}

function derivedLineCode(displayGroup: string, line: DerivedDef): string {
  if (!displayGroup) {
    return line.code.includes('.') ? (line.code.split('.')[1] ?? line.code) : line.code;
  }
  const suffix = line.code.includes('.') ? (line.code.split('.')[1] ?? line.code) : line.code;
  return `${displayGroup}.${suffix}`;
}

function catalogCode(displayGroup: string, group: GroupDef, catalogIndex: number): string {
  if (!displayGroup) {
    return String(catalogIndex + 1);
  }
  const maxDerived = group.derived.reduce((max, line) => {
    const suffix = Number(line.code.split('.')[1] ?? 0);
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);
  return `${displayGroup}.${maxDerived + 1 + catalogIndex}`;
}

function dayFactsInMonth(document: PrototypeDocument, month: string): OpexDayFact[] {
  return (document.opexDayFacts ?? []).filter((item) => item.occurredOn.startsWith(`${month}-`));
}

function dayFactAmount(document: PrototypeDocument, month: string, lineId: string): number {
  let sum = 0;
  for (const day of dayFactsInMonth(document, month)) {
    for (const line of day.lines) {
      if (line.lineId === lineId) {
        sum += line.amountExVat;
      }
    }
  }
  return sum;
}

function findOtherLine(document: PrototypeDocument, lineId: string): OpexOtherLine | null {
  return document.opexOtherLines.find((item) => item.id === lineId) ?? null;
}

function amountsForOtherLine(
  document: PrototypeDocument,
  month: string,
  line: OpexOtherLine,
  revenueWithVat: number,
): { planExVat: number; factExVat: number } {
  const stored = storedLine(opexLines(document, month), line.id);
  const planExVat = line.kind === 'agency' ? agencyPlanExVat(revenueWithVat) : (stored?.planExVat ?? 0);
  const factExVat = promotedSet(document).has(line.groupCode)
    ? dayFactAmount(document, month, line.id)
    : (stored?.factExVat ?? 0);
  return { planExVat, factExVat };
}

/** Рабочие статьи + удалённые с ненулевым планом или фактом месяца. */
function otherLinesForGroupMonth(
  document: PrototypeDocument,
  groupCode: OpexGroupCode,
  month: string,
  revenueWithVat: number,
): OpexOtherLine[] {
  return document.opexOtherLines.filter((item) => {
    if (item.groupCode !== groupCode) {
      return false;
    }
    if (item.deletedAt === null) {
      return true;
    }
    const amounts = amountsForOtherLine(document, month, item, revenueWithVat);
    return amounts.planExVat !== 0 || amounts.factExVat !== 0;
  });
}

function derivedLineAmounts(
  source: DerivedDef['source'],
  hr: ReturnType<typeof hrMonthView>,
  transport: ReturnType<typeof transportMonthView>,
): { planExVat: number; factExVat: number } {
  switch (source) {
    case 'hr-payroll':
      return { planExVat: hr.total.planPayrollExVat, factExVat: hr.total.factPayrollExVat };
    case 'hr-tax':
      return { planExVat: hr.taxTotal.planAmountExVat, factExVat: hr.taxTotal.factAmountExVat };
    case 'hr-outsourcing':
      return { planExVat: hr.total.outsourcingPlanExVat, factExVat: hr.total.outsourcingFactExVat };
    case 'transport-hire':
      return { planExVat: transport.hireTotalPlanExVat, factExVat: transport.hireTotalFactExVat };
    case 'transport-fuel':
      return { planExVat: transport.ownTotalPlanExVat, factExVat: transport.ownTotalFactExVat };
  }
}

/**
 * Таблица операционных расходов месяца. Итог = `Operation Expense!E62` / `F62` → свод.
 * Выручка для доли и агентского — без факторинга.
 */
export function operatingExpenseMonthView(
  document: PrototypeDocument,
  month: string,
  revenueWithVat: number,
  revenueExVat: number,
): OpexMonthView {
  const hr = hrMonthView(document, month);
  const transport = transportMonthView(document, month);
  const groups: OpexGroupView[] = [];
  let totalPlan = 0;
  let totalFact = 0;

  for (const group of GROUPS) {
    const lineRows: OpexLineView[] = [];

    for (const line of group.derived) {
      const amounts = derivedLineAmounts(line.source, hr, transport);
      lineRows.push({
        id: line.id,
        kind: 'derived',
        code: line.code,
        name: line.name,
        deleted: false,
        planExVat: amounts.planExVat,
        factExVat: amounts.factExVat,
        varianceExVat: amounts.factExVat - amounts.planExVat,
        planShareHundredths: shareHundredths(amounts.planExVat, revenueExVat),
        factShareHundredths: shareHundredths(amounts.factExVat, revenueExVat),
      });
    }

    const catalog = otherLinesForGroupMonth(document, group.code, month, revenueWithVat);
    catalog.forEach((line, index) => {
      const amounts = amountsForOtherLine(document, month, line, revenueWithVat);
      lineRows.push({
        id: line.id,
        kind: 'editable',
        code: catalogCode(group.code, group, index),
        name: line.name,
        deleted: line.deletedAt !== null,
        planExVat: amounts.planExVat,
        factExVat: amounts.factExVat,
        varianceExVat: amounts.factExVat - amounts.planExVat,
        planShareHundredths: shareHundredths(amounts.planExVat, revenueExVat),
        factShareHundredths: shareHundredths(amounts.factExVat, revenueExVat),
      });
    });

    const groupPlan = lineRows.reduce((sum, item) => sum + item.planExVat, 0);
    const groupFact = lineRows.reduce((sum, item) => sum + item.factExVat, 0);
    groups.push({
      id: `group-${group.code}`,
      code: group.code,
      name: group.name,
      planExVat: groupPlan,
      factExVat: groupFact,
      varianceExVat: groupFact - groupPlan,
      planShareHundredths: shareHundredths(groupPlan, revenueExVat),
      factShareHundredths: shareHundredths(groupFact, revenueExVat),
      lines: lineRows,
    });
    totalPlan += groupPlan;
    totalFact += groupFact;
  }

  return {
    month,
    groups,
    totalPlanExVat: totalPlan,
    totalFactExVat: totalFact,
    totalVarianceExVat: totalFact - totalPlan,
  };
}

function buildOtherGroupView(
  document: PrototypeDocument,
  month: string,
  revenueWithVat: number,
  group: GroupDef,
  hr: ReturnType<typeof hrMonthView>,
  transport: ReturnType<typeof transportMonthView>,
  numbering: OtherNumbering,
): OpexOtherGroupView {
  const lines: OpexOtherLineView[] = [];
  const displayCode = displayGroupCode(numbering);

  for (const line of group.derived) {
    const amounts = derivedLineAmounts(line.source, hr, transport);
    lines.push({
      id: line.id,
      code: derivedLineCode(displayCode, line),
      name: line.name,
      kind: 'derived',
      deleted: false,
      planExVat: amounts.planExVat,
      factExVat: amounts.factExVat,
      varianceExVat: amounts.factExVat - amounts.planExVat,
      planEditable: false,
      factEditable: false,
    });
  }

  const catalog = otherLinesForGroupMonth(document, group.code, month, revenueWithVat);
  catalog.forEach((line, index) => {
    const amounts = amountsForOtherLine(document, month, line, revenueWithVat);
    const deleted = line.deletedAt !== null;
    lines.push({
      id: line.id,
      code: catalogCode(displayCode, group, index),
      name: line.name,
      kind: line.kind,
      deleted,
      planExVat: amounts.planExVat,
      factExVat: amounts.factExVat,
      varianceExVat: amounts.factExVat - amounts.planExVat,
      planEditable: !deleted && line.kind === 'standard',
      factEditable: !deleted,
    });
  });

  const groupPlan = lines.reduce((sum, item) => sum + item.planExVat, 0);
  const groupFact = lines.reduce((sum, item) => sum + item.factExVat, 0);
  return {
    code: group.code,
    displayCode,
    name: group.name,
    lines,
    totalPlanExVat: groupPlan,
    totalFactExVat: groupFact,
    totalVarianceExVat: groupFact - groupPlan,
  };
}

/**
 * Категории прочих статей на экранах «Прочее» — без поднятых в отдельный раздел.
 * Пустые категории оставляют, чтобы добавить расход. Строки HR и транспорта — только смотрят.
 */
export function operatingExpenseOtherMonthView(
  document: PrototypeDocument,
  month: string,
  revenueWithVat: number,
): OpexOtherMonthView {
  const hr = hrMonthView(document, month);
  const transport = transportMonthView(document, month);
  const promoted = promotedSet(document);
  const groups: OpexOtherGroupView[] = [];
  let totalPlan = 0;
  let totalFact = 0;

  let ordinal = 0;
  for (const group of GROUPS) {
    if (promoted.has(group.code)) {
      continue;
    }
    ordinal += 1;
    const view = buildOtherGroupView(document, month, revenueWithVat, group, hr, transport, {
      mode: 'display',
      ordinal,
    });
    groups.push(view);
    totalPlan += view.totalPlanExVat;
    totalFact += view.totalFactExVat;
  }

  return {
    month,
    groups,
    totalPlanExVat: totalPlan,
    totalFactExVat: totalFact,
    totalVarianceExVat: totalFact - totalPlan,
  };
}

/** Одна группа прочих статей для отчёта / плана / факта поднятого раздела. */
export function operatingExpenseOtherGroupMonthView(
  document: PrototypeDocument,
  month: string,
  groupCode: OpexGroupCode,
  revenueWithVat: number,
): OpexOtherGroupView | null {
  if (!isOpexGroupCode(groupCode)) {
    return null;
  }
  const hr = hrMonthView(document, month);
  const transport = transportMonthView(document, month);
  return buildOtherGroupView(document, month, revenueWithVat, groupDef(groupCode), hr, transport, {
    mode: 'standalone',
  });
}

/** Та же группа на дату: факт — сумма (значение) дня, план — месячный. */
export function operatingExpenseOtherGroupDayView(
  document: PrototypeDocument,
  occurredOn: string,
  groupCode: OpexGroupCode,
  revenueWithVat: number,
): OpexOtherGroupView | null {
  if (!isOccurredOn(occurredOn)) {
    return null;
  }
  const month = occurredOn.slice(0, 7);
  const base = operatingExpenseOtherGroupMonthView(document, month, groupCode, revenueWithVat);
  if (!base) {
    return null;
  }
  const day = (document.opexDayFacts ?? []).find((item) => item.occurredOn === occurredOn);
  const lines = base.lines.map((line) => {
    const factExVat = day?.lines.find((item) => item.lineId === line.id)?.amountExVat ?? 0;
    return {
      ...line,
      factExVat,
      varianceExVat: factExVat - line.planExVat,
    };
  });
  const totalFactExVat = lines.reduce((sum, item) => sum + item.factExVat, 0);
  return {
    ...base,
    lines,
    totalFactExVat,
    totalVarianceExVat: totalFactExVat - base.totalPlanExVat,
  };
}

export function promoteOpexGroupRejection(document: PrototypeDocument, groupCode: string): OpexFieldRejection | null {
  if (!isOpexGroupCode(groupCode)) {
    return 'group';
  }
  if (!isPromotableOpexGroupCode(groupCode)) {
    return 'not-promotable';
  }
  if (promotedSet(document).has(groupCode)) {
    return 'promoted';
  }
  return null;
}

function writeMonthLineAmounts(
  document: PrototypeDocument,
  month: string,
  lineId: string,
  planExVat: number,
  factExVat: number,
): PrototypeDocument {
  const existing = opexLines(document, month);
  const nextLine: OpexMonthLine = {
    id: `opex-line:${month}:${lineId}`,
    lineId,
    planExVat,
    factExVat,
  };

  if (!existing) {
    if (planExVat === 0 && factExVat === 0) {
      return document;
    }
    return {
      ...document,
      opexMonthLines: [...document.opexMonthLines, { id: `opex:${month}`, month, lines: [nextLine] }],
    };
  }

  const without = existing.lines.filter((item) => item.lineId !== lineId);
  const lines = planExVat === 0 && factExVat === 0 ? without : [...without, nextLine];
  if (lines.length === 0) {
    return {
      ...document,
      opexMonthLines: document.opexMonthLines.filter((item) => item.month !== month),
    };
  }
  return {
    ...document,
    opexMonthLines: document.opexMonthLines.map((item) => (item.month === month ? { ...item, lines } : item)),
  };
}

function writeDayLineAmount(
  document: PrototypeDocument,
  occurredOn: string,
  lineId: string,
  amountExVat: number,
): PrototypeDocument {
  const dayFacts = document.opexDayFacts ?? [];
  const existing = dayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine: OpexDayLine = {
    id: `opex-day-line:${occurredOn}:${lineId}`,
    lineId,
    amountExVat,
  };

  if (!existing) {
    if (amountExVat === 0) {
      return document;
    }
    return {
      ...document,
      opexDayFacts: [...dayFacts, { id: `opex-day:${occurredOn}`, occurredOn, lines: [nextLine] }],
    };
  }

  const without = existing.lines.filter((item) => item.lineId !== lineId);
  const lines = amountExVat === 0 ? without : [...without, nextLine];
  if (lines.length === 0) {
    return {
      ...document,
      opexDayFacts: dayFacts.filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    opexDayFacts: dayFacts.map((item) => (item.occurredOn === occurredOn ? { ...item, lines } : item)),
  };
}

function lineIdsForGroup(document: PrototypeDocument, groupCode: OpexGroupCode): Set<string> {
  return new Set(document.opexOtherLines.filter((item) => item.groupCode === groupCode).map((item) => item.id));
}

/** Месячный факт → 1-е число; план остаётся в месяце. */
function migrateMonthFactToDayOne(document: PrototypeDocument, groupCode: OpexGroupCode): PrototypeDocument {
  const lineIds = lineIdsForGroup(document, groupCode);
  let next = document;
  for (const monthBlock of document.opexMonthLines) {
    for (const line of monthBlock.lines) {
      if (!lineIds.has(line.lineId) || line.factExVat === 0) {
        continue;
      }
      next = writeDayLineAmount(next, `${monthBlock.month}-01`, line.lineId, line.factExVat);
      next = writeMonthLineAmounts(next, monthBlock.month, line.lineId, line.planExVat, 0);
    }
  }
  return next;
}

/** Сумма дней → месячный факт; дневные строки группы стираются. */
function foldDayFactsIntoMonth(document: PrototypeDocument, groupCode: OpexGroupCode): PrototypeDocument {
  const lineIds = lineIdsForGroup(document, groupCode);
  const dayFacts = document.opexDayFacts ?? [];
  const sums = new Map<string, Map<string, number>>();

  for (const day of dayFacts) {
    const month = day.occurredOn.slice(0, 7);
    for (const line of day.lines) {
      if (!lineIds.has(line.lineId)) {
        continue;
      }
      const byLine = sums.get(month) ?? new Map<string, number>();
      byLine.set(line.lineId, (byLine.get(line.lineId) ?? 0) + line.amountExVat);
      sums.set(month, byLine);
    }
  }

  let next = document;
  for (const [month, byLine] of sums) {
    for (const [lineId, factExVat] of byLine) {
      const stored = storedLine(opexLines(next, month), lineId);
      next = writeMonthLineAmounts(next, month, lineId, stored?.planExVat ?? 0, factExVat);
    }
  }

  next = {
    ...next,
    opexDayFacts: (next.opexDayFacts ?? [])
      .map((day) => ({
        ...day,
        lines: day.lines.filter((line) => !lineIds.has(line.lineId)),
      }))
      .filter((day) => day.lines.length > 0),
  };
  return next;
}

export function promoteOpexGroup(document: PrototypeDocument, groupCode: OpexGroupCode): PrototypeDocument {
  if (promoteOpexGroupRejection(document, groupCode)) {
    return document;
  }
  const migrated = migrateMonthFactToDayOne(document, groupCode);
  const next = [...migrated.opexPromotedGroupCodes, groupCode].sort((a, b) => Number(a) - Number(b));
  return { ...migrated, opexPromotedGroupCodes: next };
}

export function demoteOpexGroupRejection(document: PrototypeDocument, groupCode: string): OpexFieldRejection | null {
  if (!isOpexGroupCode(groupCode)) {
    return 'group';
  }
  if (!promotedSet(document).has(groupCode)) {
    return 'not-promoted';
  }
  return null;
}

export function demoteOpexGroup(document: PrototypeDocument, groupCode: OpexGroupCode): PrototypeDocument {
  if (demoteOpexGroupRejection(document, groupCode)) {
    return document;
  }
  const folded = foldDayFactsIntoMonth(document, groupCode);
  return {
    ...folded,
    opexPromotedGroupCodes: folded.opexPromotedGroupCodes.filter((code) => code !== groupCode),
  };
}

/** Итог без НДС для свода продаж. `Svod!G4` / `I4`. */
export function monthOperatingExpenseAmounts(
  document: PrototypeDocument,
  month: string,
  revenueWithVat = 0,
  revenueExVat = 0,
): { planExVat: number; factExVat: number } {
  const view = operatingExpenseMonthView(document, month, revenueWithVat, revenueExVat);
  return { planExVat: view.totalPlanExVat, factExVat: view.totalFactExVat };
}

export function setOpexLineRejection(
  document: PrototypeDocument,
  month: string,
  lineId: string,
  side: 'plan' | 'fact',
  amountExVat: number,
): OpexFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const line = findOtherLine(document, lineId);
  if (!line) {
    return 'missing';
  }
  if (line.deletedAt !== null) {
    return 'archived';
  }
  if (line.kind === 'agency' && side === 'plan') {
    return 'line';
  }
  if (side === 'fact' && promotedSet(document).has(line.groupCode)) {
    return 'daily';
  }
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

export function setOpexLine(
  document: PrototypeDocument,
  month: string,
  lineId: string,
  side: 'plan' | 'fact',
  amountExVat: number,
): PrototypeDocument {
  if (setOpexLineRejection(document, month, lineId, side, amountExVat)) {
    return document;
  }
  const existing = opexLines(document, month);
  const current = storedLine(existing, lineId);
  const nextPlan = side === 'plan' ? amountExVat : (current?.planExVat ?? 0);
  const nextFact = side === 'fact' ? amountExVat : (current?.factExVat ?? 0);
  return writeMonthLineAmounts(document, month, lineId, nextPlan, nextFact);
}

export function setOpexDayLineRejection(
  document: PrototypeDocument,
  occurredOn: string,
  lineId: string,
  amountExVat: number,
): OpexFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  const line = findOtherLine(document, lineId);
  if (!line) {
    return 'missing';
  }
  if (line.deletedAt !== null) {
    return 'archived';
  }
  if (!promotedSet(document).has(line.groupCode)) {
    return 'not-promoted';
  }
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

export function setOpexDayLine(
  document: PrototypeDocument,
  occurredOn: string,
  lineId: string,
  amountExVat: number,
): PrototypeDocument {
  if (setOpexDayLineRejection(document, occurredOn, lineId, amountExVat)) {
    return document;
  }
  return writeDayLineAmount(document, occurredOn, lineId, amountExVat);
}

export function opexDayLineValue(document: PrototypeDocument, occurredOn: string, lineId: string): number {
  const day = (document.opexDayFacts ?? []).find((item) => item.occurredOn === occurredOn);
  return day?.lines.find((item) => item.lineId === lineId)?.amountExVat ?? 0;
}

export function addOpexOtherLineRejection(
  document: PrototypeDocument,
  groupCode: OpexGroupCode,
  name: string,
): OpexFieldRejection | null {
  if (!isOpexGroupCode(groupCode)) {
    return 'group';
  }
  const trimmed = name.trim();
  if (trimmed.length > MAX_NAME) {
    return 'too-long';
  }
  return rejectName(trimmed, otherLinesForGroup(document, groupCode));
}

export function addOpexOtherLine(
  document: PrototypeDocument,
  line: Omit<OpexOtherLine, 'kind' | 'deletedAt' | 'name'> & { name: string },
): PrototypeDocument {
  if (addOpexOtherLineRejection(document, line.groupCode, line.name)) {
    return document;
  }
  const next: OpexOtherLine = {
    id: line.id,
    groupCode: line.groupCode,
    name: line.name.trim(),
    kind: 'standard',
    deletedAt: null,
  };
  return {
    ...document,
    opexOtherLines: [...document.opexOtherLines, next],
  };
}

export function renameOpexOtherLineRejection(
  document: PrototypeDocument,
  lineId: string,
  name: string,
): OpexFieldRejection | null {
  const line = findOtherLine(document, lineId);
  if (!line || line.deletedAt !== null) {
    return 'missing';
  }
  if (line.kind === 'agency') {
    return 'line';
  }
  const trimmed = name.trim();
  if (trimmed.length > MAX_NAME) {
    return 'too-long';
  }
  return rejectName(trimmed, otherLinesForGroup(document, line.groupCode), lineId);
}

export function renameOpexOtherLine(document: PrototypeDocument, lineId: string, name: string): PrototypeDocument {
  if (renameOpexOtherLineRejection(document, lineId, name)) {
    return document;
  }
  const trimmed = name.trim();
  return {
    ...document,
    opexOtherLines: document.opexOtherLines.map((item) => (item.id === lineId ? { ...item, name: trimmed } : item)),
  };
}

export function deleteOpexOtherLine(document: PrototypeDocument, lineId: string, deletedAt: string): PrototypeDocument {
  const line = findOtherLine(document, lineId);
  if (!line || line.deletedAt !== null || line.kind === 'agency' || !isDeletionMark(deletedAt)) {
    return document;
  }
  return {
    ...document,
    opexOtherLines: document.opexOtherLines.map((item) => (item.id === lineId ? { ...item, deletedAt } : item)),
  };
}

export function restoreOpexOtherLineRejection(document: PrototypeDocument, lineId: string): OpexFieldRejection | null {
  const line = findOtherLine(document, lineId);
  if (!line || line.deletedAt === null) {
    return 'missing';
  }
  return rejectName(line.name, otherLinesForGroup(document, line.groupCode), lineId);
}

export function restoreOpexOtherLine(document: PrototypeDocument, lineId: string): PrototypeDocument {
  if (restoreOpexOtherLineRejection(document, lineId)) {
    return document;
  }
  return {
    ...document,
    opexOtherLines: document.opexOtherLines.map((item) => (item.id === lineId ? { ...item, deletedAt: null } : item)),
  };
}

export { GROUPS as OPEX_GROUPS };
