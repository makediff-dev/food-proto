import { type NameRejection, rejectName } from '@/domain/directory';
import {
  isDeletionMark,
  isMonthKey,
  isOpexGroupCode,
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

export type OpexFieldRejection = 'missing' | 'month' | 'amount' | 'line' | 'group' | 'archived' | NameRejection;

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
  name: string;
  lines: OpexOtherLineView[];
  totalPlanExVat: number;
  totalFactExVat: number;
  totalVarianceExVat: number;
}

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

function catalogCode(group: GroupDef, catalogIndex: number): string {
  const maxDerived = group.derived.reduce((max, line) => {
    const suffix = Number(line.code.split('.')[1] ?? 0);
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);
  return `${group.code}.${maxDerived + 1 + catalogIndex}`;
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
  if (line.kind === 'agency') {
    return {
      planExVat: agencyPlanExVat(revenueWithVat),
      factExVat: stored?.factExVat ?? 0,
    };
  }
  return {
    planExVat: stored?.planExVat ?? 0,
    factExVat: stored?.factExVat ?? 0,
  };
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
        code: catalogCode(group, index),
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

/** Категории прочих статей — даже пустые, чтобы добавить расход. Строки HR и транспорта — только смотрят. */
export function operatingExpenseOtherMonthView(
  document: PrototypeDocument,
  month: string,
  revenueWithVat: number,
): OpexOtherMonthView {
  const hr = hrMonthView(document, month);
  const transport = transportMonthView(document, month);
  const groups: OpexOtherGroupView[] = [];
  let totalPlan = 0;
  let totalFact = 0;

  for (const group of GROUPS) {
    const lines: OpexOtherLineView[] = [];

    for (const line of group.derived) {
      const amounts = derivedLineAmounts(line.source, hr, transport);
      lines.push({
        id: line.id,
        code: line.code,
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
        code: catalogCode(group, index),
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
    groups.push({
      code: group.code,
      name: group.name,
      lines,
      totalPlanExVat: groupPlan,
      totalFactExVat: groupFact,
      totalVarianceExVat: groupFact - groupPlan,
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
  const nextLine: OpexMonthLine = {
    id: `opex-line:${month}:${lineId}`,
    lineId,
    planExVat: nextPlan,
    factExVat: nextFact,
  };

  if (!existing) {
    if (nextPlan === 0 && nextFact === 0) {
      return document;
    }
    return {
      ...document,
      opexMonthLines: [...document.opexMonthLines, { id: `opex:${month}`, month, lines: [nextLine] }],
    };
  }

  const without = existing.lines.filter((item) => item.lineId !== lineId);
  const lines = nextPlan === 0 && nextFact === 0 ? without : [...without, nextLine];
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
  if (!line || line.deletedAt !== null || !isDeletionMark(deletedAt)) {
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
