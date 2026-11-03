import {
  isMonthKey,
  isOpexEditableLineId,
  OPEX_EDITABLE_LINE_IDS,
  type OpexEditableLineId,
  type OpexMonthLine,
  type OpexMonthLines,
  type PrototypeDocument,
} from '@/domain/document';
import { hrMonthView } from '@/domain/hr';
import { ratioRound } from '@/domain/money';
import { transportMonthView } from '@/domain/transport';

const MAX_MONEY = 100_000_000_000;

/** Доля агентского соглашения от выручки с НДС. `Operation Expense!E41 = Svod!G2*0.07`. */
export const AGENCY_FEE_PERCENT = 7;

export type OpexFieldRejection = 'missing' | 'month' | 'amount' | 'line';

export type OpexRowKind = 'group' | 'derived' | 'editable';

export interface OpexRowView {
  id: string;
  kind: OpexRowKind;
  /** Номер/код как в книге: «1.1», «2». */
  code: string;
  name: string;
  planExVat: number;
  factExVat: number;
  varianceExVat: number;
  planShareHundredths: number;
  factShareHundredths: number;
  /** Можно править план и/или факт на экране отчёта. */
  planEditable: boolean;
  factEditable: boolean;
}

export interface OpexMonthView {
  month: string;
  rows: OpexRowView[];
  totalPlanExVat: number;
  totalFactExVat: number;
  totalVarianceExVat: number;
}

interface LineDef {
  id: OpexEditableLineId | 'payroll' | 'payrollTax' | 'outsourcing' | 'hireTransport' | 'ownFuel';
  code: string;
  name: string;
  source: 'hr-payroll' | 'hr-tax' | 'hr-outsourcing' | 'transport-hire' | 'transport-fuel' | 'editable' | 'agency';
}

interface GroupDef {
  code: string;
  name: string;
  lines: LineDef[];
}

const GROUPS: readonly GroupDef[] = [
  {
    code: '1',
    name: 'Фонд оплаты персонала',
    lines: [
      { id: 'payroll', code: '1.1', name: 'Зарплата на руки штатным сотрудникам', source: 'hr-payroll' },
      { id: 'payrollTax', code: '1.2', name: 'Налоги от зарплаты', source: 'hr-tax' },
      { id: 'outsourcing', code: '1.3', name: 'Аутсорсинг персонала', source: 'hr-outsourcing' },
    ],
  },
  {
    code: '2',
    name: 'Базовые ресурсы',
    lines: [
      { id: 'electricity', code: '2.1', name: 'Электроэнергия', source: 'editable' },
      { id: 'water', code: '2.2', name: 'Водоснабжение', source: 'editable' },
      { id: 'sewage', code: '2.3', name: 'Вывоз стоков', source: 'editable' },
      { id: 'garbage', code: '2.4', name: 'Вывоз мусора', source: 'editable' },
      { id: 'pellets', code: '2.5', name: 'Пелеты для отопления', source: 'editable' },
    ],
  },
  {
    code: '3',
    name: 'Связь и коммуникации',
    lines: [
      { id: 'internetFixed', code: '3.1', name: 'Стационарный интернет', source: 'editable' },
      { id: 'internetMobile', code: '3.2', name: 'Мобильный интернет', source: 'editable' },
      { id: 'glonass', code: '3.3', name: 'Услуги ГЛОНАСС', source: 'editable' },
    ],
  },
  {
    code: '4',
    name: 'Общепроизводственные расходы',
    lines: [
      { id: 'trashBags', code: '4.1', name: 'пакеты для мусора', source: 'editable' },
      { id: 'gloves', code: '4.2', name: 'перчатки одноразовые', source: 'editable' },
      { id: 'workwear', code: '4.3', name: 'спецодежда', source: 'editable' },
      { id: 'staffMeals', code: '4.4', name: 'Питание персонала', source: 'editable' },
      { id: 'deratization', code: '4.5', name: 'Дератизация', source: 'editable' },
      { id: 'haccp', code: '4.6', name: 'Оснащение по ХАССП', source: 'editable' },
      { id: 'detergents', code: '4.7', name: 'Моющие средства', source: 'editable' },
      { id: 'hygiene', code: '4.8', name: 'Расходники по гигиене предприятия', source: 'editable' },
    ],
  },
  {
    code: '5',
    name: 'Общехозяйственные расходы',
    lines: [
      { id: 'cartridges', code: '5.1', name: 'картриджи для принтеров', source: 'editable' },
      { id: 'stationery', code: '5.2', name: 'канцелярские принадлежности и бумага', source: 'editable' },
      { id: 'remoteWarehouse', code: '5.3', name: 'Аренда удаленного склада', source: 'editable' },
      { id: 'factoryRent', code: '5.4', name: 'Аренда заводского здания', source: 'editable' },
      { id: 'tbankFee', code: '5.5', name: 'Комиссия Т-Банка за денежные переводы', source: 'editable' },
      { id: 'consulting', code: '5.6', name: 'Что Делать консалт', source: 'editable' },
    ],
  },
  {
    code: '6',
    name: 'Коммерческие расходы',
    lines: [
      { id: 'agency', code: '6.1', name: 'Агентское соглашение', source: 'agency' },
      { id: 'certification', code: '6.2', name: 'Регистрация и сертификация', source: 'editable' },
    ],
  },
  {
    code: '7',
    name: 'Транспортные расходы',
    lines: [
      { id: 'hireTransport', code: '7.1', name: 'Наемный транспорт', source: 'transport-hire' },
      { id: 'ownFuel', code: '7.2', name: 'Топливо для собственного транспорта', source: 'transport-fuel' },
      { id: 'maintenance', code: '7.3', name: 'ТО собственного транспорта', source: 'editable' },
      { id: 'insurance', code: '7.4', name: 'Страхование транспорта', source: 'editable' },
      { id: 'leasing', code: '7.5', name: 'Лизинговые платежи по собственному транспорту', source: 'editable' },
      {
        id: 'otherTransportMaterials',
        code: '7.6',
        name: 'Прочие материалы по собственному транспорту',
        source: 'editable',
      },
      { id: 'gazelleRent', code: '7.7', name: 'Аренда Газели', source: 'editable' },
    ],
  },
  {
    code: '8',
    name: 'Ремонт и содержание оборудования',
    lines: [
      { id: 'fridgeService', code: '8.1', name: 'обслуживание холодильного оборудования', source: 'editable' },
      { id: 'waterPrepService', code: '8.2', name: 'Обслуживание водоподготовки', source: 'editable' },
      { id: 'waterPrepMaterials', code: '8.3', name: 'Материалы для водоподготовки', source: 'editable' },
      {
        id: 'plumbing',
        code: '8.4',
        name: 'Сантехника и электрика для нового оборудования',
        source: 'editable',
      },
      { id: 'bakeryParts', code: '8.5', name: 'Запчасти для пекарни', source: 'editable' },
      { id: 'meatParts', code: '8.6', name: 'Запчасти для мясного цеха', source: 'editable' },
      {
        id: 'assemblyParts',
        code: '8.7',
        name: 'Сервисные работы и Запчасти для сборки и упаковки',
        source: 'editable',
      },
      { id: 'buildings', code: '8.8', name: 'Ремонт и содержание зданий и сооружений', source: 'editable' },
    ],
  },
];

export const OPEX_EDITABLE_LINE_LABELS: Record<OpexEditableLineId, string> = Object.fromEntries(
  GROUPS.flatMap((group) =>
    group.lines
      .filter((line) => line.source === 'editable' || line.source === 'agency')
      .map((line) => [line.id, line.name]),
  ),
) as Record<OpexEditableLineId, string>;

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

function storedLine(lines: OpexMonthLines | null, lineId: OpexEditableLineId): OpexMonthLine | null {
  return lines?.lines.find((item) => item.lineId === lineId) ?? null;
}

function agencyPlanExVat(revenueWithVat: number): number {
  return ratioRound(revenueWithVat * AGENCY_FEE_PERCENT, 100) ?? 0;
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
  const stored = opexLines(document, month);
  const rows: OpexRowView[] = [];
  let totalPlan = 0;
  let totalFact = 0;

  for (const group of GROUPS) {
    const lineRows: OpexRowView[] = [];
    for (const line of group.lines) {
      let planExVat = 0;
      let factExVat = 0;
      let planEditable = false;
      let factEditable = false;
      let kind: OpexRowView['kind'] = 'derived';

      switch (line.source) {
        case 'hr-payroll':
          planExVat = hr.total.planPayrollExVat;
          factExVat = hr.total.factPayrollExVat;
          break;
        case 'hr-tax':
          planExVat = hr.taxTotal.planAmountExVat;
          factExVat = hr.taxTotal.factAmountExVat;
          break;
        case 'hr-outsourcing':
          planExVat = hr.total.outsourcingPlanExVat;
          factExVat = hr.total.outsourcingFactExVat;
          break;
        case 'transport-hire':
          planExVat = transport.hireTotalPlanExVat;
          factExVat = transport.hireTotalFactExVat;
          break;
        case 'transport-fuel':
          planExVat = transport.ownTotalPlanExVat;
          factExVat = transport.ownTotalFactExVat;
          break;
        case 'agency': {
          const row = storedLine(stored, 'agency');
          planExVat = agencyPlanExVat(revenueWithVat);
          factExVat = row?.factExVat ?? 0;
          planEditable = false;
          factEditable = true;
          kind = 'editable';
          break;
        }
        case 'editable': {
          const id = line.id as OpexEditableLineId;
          const row = storedLine(stored, id);
          planExVat = row?.planExVat ?? 0;
          factExVat = row?.factExVat ?? 0;
          planEditable = true;
          factEditable = true;
          kind = 'editable';
          break;
        }
      }

      lineRows.push({
        id: line.id,
        kind,
        code: line.code,
        name: line.name,
        planExVat,
        factExVat,
        varianceExVat: factExVat - planExVat,
        planShareHundredths: shareHundredths(planExVat, revenueExVat),
        factShareHundredths: shareHundredths(factExVat, revenueExVat),
        planEditable,
        factEditable,
      });
    }

    const groupPlan = lineRows.reduce((sum, item) => sum + item.planExVat, 0);
    const groupFact = lineRows.reduce((sum, item) => sum + item.factExVat, 0);
    rows.push({
      id: `group-${group.code}`,
      kind: 'group',
      code: group.code,
      name: group.name,
      planExVat: groupPlan,
      factExVat: groupFact,
      varianceExVat: groupFact - groupPlan,
      planShareHundredths: shareHundredths(groupPlan, revenueExVat),
      factShareHundredths: shareHundredths(groupFact, revenueExVat),
      planEditable: false,
      factEditable: false,
    });
    rows.push(...lineRows);
    totalPlan += groupPlan;
    totalFact += groupFact;
  }

  return {
    month,
    rows,
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
  _document: PrototypeDocument,
  month: string,
  lineId: OpexEditableLineId,
  side: 'plan' | 'fact',
  amountExVat: number,
): OpexFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isOpexEditableLineId(lineId)) {
    return 'line';
  }
  if (lineId === 'agency' && side === 'plan') {
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
  lineId: OpexEditableLineId,
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

export { GROUPS as OPEX_GROUPS, OPEX_EDITABLE_LINE_IDS };
