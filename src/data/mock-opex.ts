import {
  type HrDayFact,
  type HrMonthFact,
  type HrMonthPlan,
  type HrPosition,
  type HrShopDepartmentId,
  type HrTaxRatesMonth,
  isHrShopDepartmentId,
  type OpexMonthLines,
  type TransportCarrier,
  type TransportHireDayFact,
  type TransportHireKind,
  type TransportHireMonthPlan,
  type TransportOwnDayFact,
  type TransportOwnMonthPlan,
  type TransportVehicle,
} from '@/domain/document';
import {
  DEFAULT_INJURY_HUNDREDTHS,
  DEFAULT_NDFL_HUNDREDTHS,
  DEFAULT_OUTSOURCING_VAT_HUNDREDTHS,
  DEFAULT_SOCIAL_HUNDREDTHS,
} from '@/domain/hr';
import { ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { daysInMonth } from '@/domain/sales-plan';

function staff(id: string, departmentId: HrPosition['departmentId'], name: string): HrPosition {
  return { id, departmentId, name, kind: 'staff', deletedAt: null };
}

function outsourcing(departmentId: HrShopDepartmentId): HrPosition {
  return {
    id: `hr-out:${departmentId}`,
    departmentId,
    name: 'Аутсорсинговый персонал',
    kind: 'outsourcing',
    deletedAt: null,
  };
}

/** Должности листа `HR` — именованные строки без пустых заготовок. */
export const mockHrPositions: HrPosition[] = [
  staff('hr-admin-production-director', 'admin', 'Директор по производству'),
  staff('hr-admin-chief-accountant', 'admin', 'Главный бухгалтер'),
  staff('hr-admin-chief-technologist', 'admin', 'Главный технолог'),
  staff('hr-admin-procurement-economist', 'admin', 'Директор по закупкам & Гл экономист'),
  staff('hr-admin-chief-lawyer', 'admin', 'Главный юрист'),
  staff('hr-admin-tech-director', 'admin', 'Технический директор'),
  staff('hr-admin-tech-deputy', 'admin', 'Зам. Технического директора'),
  staff('hr-admin-accountant', 'admin', 'Бухгалтер'),
  staff('hr-admin-cleaner', 'admin', 'Мастер чистоты'),
  staff('hr-admin-storekeeper', 'admin', 'Кладовщик'),

  staff('hr-meat-1-foreman', 'meat-1', 'Бригадир цеха'),
  staff('hr-meat-1-mince', 'meat-1', 'Оператор фаршесоставления'),
  staff('hr-meat-1-former', 'meat-1', 'Формовщик'),
  staff('hr-meat-1-heat', 'meat-1', 'Оператор термообработки'),
  outsourcing('meat-1'),
  outsourcing('meat-2'),

  staff('hr-bakery-1-foreman', 'bakery-1', 'Бригадир цеха'),
  staff('hr-bakery-1-dough', 'bakery-1', 'Оператор тестомеса'),
  staff('hr-bakery-1-divider', 'bakery-1', 'Оператор тестоделителя-округлителя'),
  staff('hr-bakery-1-heat', 'bakery-1', 'Оператор термообработки'),
  staff('hr-bakery-1-cool', 'bakery-1', 'Оператор охлаждения'),
  outsourcing('bakery-1'),
  outsourcing('bakery-2'),

  staff('hr-veg-1-operator', 'vegetables-1', 'Оператор овощного цеха'),
  outsourcing('vegetables-1'),
  outsourcing('vegetables-2'),

  staff('hr-soup-1-operator', 'soup-1', 'Оператор цеха варки'),
  outsourcing('soup-1'),
  outsourcing('soup-2'),

  staff('hr-sides-1-operator', 'sides-1', 'Оператор цеха гарниров'),
  outsourcing('sides-1'),
  outsourcing('sides-2'),

  staff('hr-assembly-1-foreman', 'assembly-1', 'Бригадир цеха'),
  staff('hr-assembly-1-line', 'assembly-1', 'Оператор сборочной линии Крумбайн'),
  staff('hr-assembly-1-pack', 'assembly-1', 'Оператор упаковочных машин'),
  staff('hr-assembly-1-loader', 'assembly-1', 'Грузчик-сборщик'),
  outsourcing('assembly-1'),
  outsourcing('assembly-2'),

  staff('hr-dc-chief', 'dc', 'Начальник РЦ'),
  staff('hr-dc-loader', 'dc', 'Грузчик-сборщик'),
  staff('hr-dc-driver', 'dc', 'Водитель Газели'),
  outsourcing('dc'),
];

function carrier(id: string, kind: TransportCarrier['kind'], name: string): TransportCarrier {
  return { id, kind, name, vatPercent: 20, deletedAt: null };
}

/** Именованные контрагенты листа `Transport`. */
export const mockTransportCarriers: TransportCarrier[] = [
  carrier('transport-finished-transsky', 'finishedDelivery', 'Трансскай24'),
  carrier('transport-finished-dial', 'finishedDelivery', 'Диал'),
  carrier('transport-finished-kazachek', 'finishedDelivery', 'Казачек Ф.В.'),
  carrier('transport-finished-kalinov', 'finishedDelivery', 'Калинов А.А.'),
  carrier('transport-finished-klr', 'finishedDelivery', 'КЛР Групп'),
  carrier('transport-material-dial', 'materialDelivery', 'Диал'),
  carrier('transport-material-klr', 'materialDelivery', 'КЛР Групп'),
];

function vehicle(id: string, name: string): TransportVehicle {
  return { id, name, fuelVatPercent: 20, deletedAt: null };
}

/** Три машины листа `Transport` в моке; на экране можно добавлять и удалять. */
export const mockTransportVehicles: TransportVehicle[] = [
  vehicle('vehicle-1', 'Авто № 1'),
  vehicle('vehicle-2', 'Авто № 2'),
  vehicle('vehicle-3', 'Авто № 3'),
];

const MOCK_VEHICLE_IDS = mockTransportVehicles.map((item) => item.id);

/**
 * Суммы сентября, октября и ноября 2026 — в масштабе мока продаж, не ставки книги.
 * План HR один и тот же: четыре должности по одному человеку, остальные строки справочника пустые.
 * Зарплаты и статьи ужаты под выручку мока: иначе свод уходит в убыток.
 * Факт людей и пробега — каждый день закрытого месяца и 1–4 ноября. Сборка в октябре работает до 20-го:
 * гамбургер отстаёт, численность цеха за месяц ниже плана. Сентябрьский ФОТ на десятую выше плана.
 * Наёмный транспорт — в дни отгрузок журнала продаж. Ноябрь ещё идёт.
 * Ставки налогов 13 %, 20 % и 0,2 %. НДС контрагентов наёмного и топлива своего парка — 20 %. План агентского считает отчёт, здесь только факт.
 */

const MOCK_MONTHS = ['2026-09', '2026-10', '2026-11'] as const;

type MockMonth = (typeof MOCK_MONTHS)[number];

const NOVEMBER_FACT_UNTIL = '2026-11-04';
const OCTOBER_ASSEMBLY_UNTIL = '2026-10-20';
const ASSEMBLY_POSITION_ID = 'hr-assembly-1-line';

const SHIPMENT_DAYS: Record<MockMonth, readonly string[]> = {
  '2026-09': ['2026-09-03', '2026-09-10', '2026-09-18'],
  '2026-10': ['2026-10-02', '2026-10-09', '2026-10-13', '2026-10-16', '2026-10-20'],
  '2026-11': ['2026-11-02'],
};

/** Рубли без НДС → копейки. */
const rub = (rubles: number) => Math.round(rubles * 100);

const people = (count: number) => count * QUANTITY_SCALE;

interface StaffSeed {
  positionId: string;
  /** Зарплата на одного, рубли без НДС. */
  salaryRub: number;
}

const STAFF_SEEDS: readonly StaffSeed[] = [
  { positionId: 'hr-admin-production-director', salaryRub: 1_200 },
  { positionId: 'hr-admin-accountant', salaryRub: 1_000 },
  { positionId: ASSEMBLY_POSITION_ID, salaryRub: 900 },
  { positionId: 'hr-dc-driver', salaryRub: 900 },
];

interface OutsourcingSeed {
  departmentId: HrShopDepartmentId;
  hourThousandths: number;
  rateRub: number;
}

const OUTSOURCING_PLAN: readonly OutsourcingSeed[] = [
  { departmentId: 'meat-1', hourThousandths: people(3), rateRub: 80 },
  { departmentId: 'assembly-1', hourThousandths: people(2), rateRub: 80 },
];

const OUTSOURCING_FACT: Record<MockMonth, readonly OutsourcingSeed[]> = {
  '2026-09': [
    { departmentId: 'meat-1', hourThousandths: 3_300, rateRub: 80 },
    { departmentId: 'assembly-1', hourThousandths: 2_200, rateRub: 90 },
  ],
  '2026-10': [
    { departmentId: 'meat-1', hourThousandths: 2_400, rateRub: 80 },
    { departmentId: 'assembly-1', hourThousandths: 1_200, rateRub: 80 },
  ],
  '2026-11': [
    { departmentId: 'meat-1', hourThousandths: 400, rateRub: 80 },
    { departmentId: 'assembly-1', hourThousandths: 200, rateRub: 80 },
  ],
};

interface HireSeed {
  carrierId: string;
  kind: TransportHireKind;
  /** Штуки или килограммы. */
  plan: number;
  fact: number;
}

/** Цена без НДС, копейки: 0,20 ₽/шт, 0,80 ₽/кг. */
const HIRE_PRICE_KOP: Record<TransportHireKind, number> = {
  finishedDelivery: 20,
  materialDelivery: 80,
};

const HIRE_SEEDS: Record<MockMonth, readonly HireSeed[]> = {
  '2026-09': [
    { carrierId: 'transport-finished-transsky', kind: 'finishedDelivery', plan: 1_100, fact: 1_200 },
    { carrierId: 'transport-finished-dial', kind: 'finishedDelivery', plan: 700, fact: 780 },
    { carrierId: 'transport-finished-kazachek', kind: 'finishedDelivery', plan: 450, fact: 500 },
    { carrierId: 'transport-finished-kalinov', kind: 'finishedDelivery', plan: 350, fact: 380 },
    { carrierId: 'transport-finished-klr', kind: 'finishedDelivery', plan: 300, fact: 340 },
    { carrierId: 'transport-material-dial', kind: 'materialDelivery', plan: 500, fact: 540 },
    { carrierId: 'transport-material-klr', kind: 'materialDelivery', plan: 300, fact: 340 },
  ],
  '2026-10': [
    { carrierId: 'transport-finished-transsky', kind: 'finishedDelivery', plan: 1_100, fact: 650 },
    { carrierId: 'transport-finished-dial', kind: 'finishedDelivery', plan: 700, fact: 420 },
    { carrierId: 'transport-finished-kazachek', kind: 'finishedDelivery', plan: 450, fact: 270 },
    { carrierId: 'transport-finished-kalinov', kind: 'finishedDelivery', plan: 350, fact: 200 },
    { carrierId: 'transport-finished-klr', kind: 'finishedDelivery', plan: 300, fact: 170 },
    { carrierId: 'transport-material-dial', kind: 'materialDelivery', plan: 500, fact: 280 },
    { carrierId: 'transport-material-klr', kind: 'materialDelivery', plan: 300, fact: 180 },
  ],
  '2026-11': [
    { carrierId: 'transport-finished-transsky', kind: 'finishedDelivery', plan: 1_200, fact: 120 },
    { carrierId: 'transport-finished-dial', kind: 'finishedDelivery', plan: 750, fact: 80 },
    { carrierId: 'transport-finished-kazachek', kind: 'finishedDelivery', plan: 480, fact: 50 },
    { carrierId: 'transport-finished-kalinov', kind: 'finishedDelivery', plan: 370, fact: 35 },
    { carrierId: 'transport-finished-klr', kind: 'finishedDelivery', plan: 300, fact: 30 },
    { carrierId: 'transport-material-dial', kind: 'materialDelivery', plan: 560, fact: 50 },
    { carrierId: 'transport-material-klr', kind: 'materialDelivery', plan: 340, fact: 40 },
  ],
};

/** Авто 1 и 2: нормы 17 и 18 л/100 км как в книге. Авто 3 в моке стоит. */
const OWN_DAILY_KM: Record<string, number> = {
  'vehicle-1': 3,
  'vehicle-2': 2,
  'vehicle-3': 0,
};

const OWN_NORM: Record<string, number> = {
  'vehicle-1': 17 * QUANTITY_SCALE,
  'vehicle-2': 18 * QUANTITY_SCALE,
  'vehicle-3': 0,
};

const OWN_PLAN_FUEL_RUB = 55;

const OWN_FACT_FUEL_RUB: Record<MockMonth, number> = {
  '2026-09': 56,
  '2026-10': 54,
  '2026-11': 55,
};

const OWN_ODOMETER_START: Record<string, number> = {
  'vehicle-1': people(12_000),
  'vehicle-2': people(8_400),
  'vehicle-3': 0,
};

interface OtherSeed {
  lineId: string;
  planRub: number;
  factRub: number;
}

const OTHER_SEEDS: Record<MockMonth, readonly OtherSeed[]> = {
  '2026-09': [
    { lineId: 'electricity', planRub: 450, factRub: 490 },
    { lineId: 'water', planRub: 100, factRub: 110 },
    { lineId: 'sewage', planRub: 60, factRub: 70 },
    { lineId: 'garbage', planRub: 80, factRub: 80 },
    { lineId: 'internetFixed', planRub: 120, factRub: 120 },
    { lineId: 'internetMobile', planRub: 80, factRub: 80 },
    { lineId: 'glonass', planRub: 50, factRub: 50 },
    { lineId: 'trashBags', planRub: 20, factRub: 25 },
    { lineId: 'gloves', planRub: 30, factRub: 35 },
    { lineId: 'workwear', planRub: 100, factRub: 100 },
    { lineId: 'staffMeals', planRub: 220, factRub: 240 },
    { lineId: 'detergents', planRub: 50, factRub: 55 },
    { lineId: 'hygiene', planRub: 40, factRub: 40 },
    { lineId: 'stationery', planRub: 25, factRub: 25 },
    { lineId: 'remoteWarehouse', planRub: 400, factRub: 400 },
    { lineId: 'factoryRent', planRub: 1_500, factRub: 1_500 },
    { lineId: 'tbankFee', planRub: 40, factRub: 45 },
    { lineId: 'consulting', planRub: 500, factRub: 500 },
    { lineId: 'agency', planRub: 0, factRub: 19_000 },
    { lineId: 'maintenance', planRub: 100, factRub: 110 },
    { lineId: 'insurance', planRub: 180, factRub: 180 },
    { lineId: 'leasing', planRub: 400, factRub: 400 },
    { lineId: 'otherTransportMaterials', planRub: 25, factRub: 30 },
    { lineId: 'gazelleRent', planRub: 200, factRub: 200 },
    { lineId: 'fridgeService', planRub: 80, factRub: 80 },
    { lineId: 'waterPrepService', planRub: 50, factRub: 50 },
    { lineId: 'waterPrepMaterials', planRub: 25, factRub: 20 },
    { lineId: 'meatParts', planRub: 50, factRub: 50 },
    { lineId: 'buildings', planRub: 80, factRub: 70 },
  ],
  '2026-10': [
    { lineId: 'electricity', planRub: 450, factRub: 400 },
    { lineId: 'water', planRub: 100, factRub: 90 },
    { lineId: 'sewage', planRub: 60, factRub: 55 },
    { lineId: 'garbage', planRub: 80, factRub: 70 },
    { lineId: 'pellets', planRub: 200, factRub: 180 },
    { lineId: 'internetFixed', planRub: 120, factRub: 120 },
    { lineId: 'internetMobile', planRub: 80, factRub: 70 },
    { lineId: 'glonass', planRub: 50, factRub: 50 },
    { lineId: 'trashBags', planRub: 20, factRub: 15 },
    { lineId: 'gloves', planRub: 30, factRub: 20 },
    { lineId: 'staffMeals', planRub: 220, factRub: 180 },
    { lineId: 'deratization', planRub: 90, factRub: 90 },
    { lineId: 'detergents', planRub: 50, factRub: 40 },
    { lineId: 'hygiene', planRub: 40, factRub: 35 },
    { lineId: 'stationery', planRub: 25, factRub: 20 },
    { lineId: 'remoteWarehouse', planRub: 400, factRub: 400 },
    { lineId: 'factoryRent', planRub: 1_500, factRub: 1_500 },
    { lineId: 'tbankFee', planRub: 40, factRub: 30 },
    { lineId: 'consulting', planRub: 500, factRub: 500 },
    { lineId: 'agency', planRub: 0, factRub: 9_800 },
    { lineId: 'certification', planRub: 200, factRub: 200 },
    { lineId: 'maintenance', planRub: 100, factRub: 90 },
    { lineId: 'insurance', planRub: 180, factRub: 180 },
    { lineId: 'leasing', planRub: 400, factRub: 400 },
    { lineId: 'otherTransportMaterials', planRub: 25, factRub: 20 },
    { lineId: 'gazelleRent', planRub: 200, factRub: 200 },
    { lineId: 'fridgeService', planRub: 80, factRub: 80 },
    { lineId: 'waterPrepService', planRub: 50, factRub: 50 },
    { lineId: 'waterPrepMaterials', planRub: 25, factRub: 20 },
    { lineId: 'bakeryParts', planRub: 120, factRub: 120 },
    { lineId: 'meatParts', planRub: 50, factRub: 40 },
    { lineId: 'buildings', planRub: 80, factRub: 60 },
  ],
  '2026-11': [
    { lineId: 'electricity', planRub: 450, factRub: 60 },
    { lineId: 'water', planRub: 100, factRub: 15 },
    { lineId: 'sewage', planRub: 60, factRub: 10 },
    { lineId: 'garbage', planRub: 80, factRub: 10 },
    { lineId: 'pellets', planRub: 400, factRub: 50 },
    { lineId: 'internetFixed', planRub: 120, factRub: 120 },
    { lineId: 'internetMobile', planRub: 80, factRub: 80 },
    { lineId: 'glonass', planRub: 50, factRub: 50 },
    { lineId: 'trashBags', planRub: 20, factRub: 5 },
    { lineId: 'gloves', planRub: 30, factRub: 5 },
    { lineId: 'staffMeals', planRub: 220, factRub: 30 },
    { lineId: 'detergents', planRub: 50, factRub: 10 },
    { lineId: 'hygiene', planRub: 40, factRub: 5 },
    { lineId: 'stationery', planRub: 25, factRub: 5 },
    { lineId: 'remoteWarehouse', planRub: 400, factRub: 400 },
    { lineId: 'factoryRent', planRub: 1_500, factRub: 1_500 },
    { lineId: 'tbankFee', planRub: 40, factRub: 5 },
    { lineId: 'consulting', planRub: 500, factRub: 500 },
    { lineId: 'agency', planRub: 0, factRub: 1_800 },
    { lineId: 'maintenance', planRub: 100, factRub: 15 },
    { lineId: 'insurance', planRub: 180, factRub: 180 },
    { lineId: 'leasing', planRub: 400, factRub: 400 },
    { lineId: 'otherTransportMaterials', planRub: 25, factRub: 5 },
    { lineId: 'gazelleRent', planRub: 200, factRub: 200 },
    { lineId: 'fridgeService', planRub: 80, factRub: 80 },
    { lineId: 'waterPrepService', planRub: 50, factRub: 50 },
    { lineId: 'waterPrepMaterials', planRub: 25, factRub: 5 },
    { lineId: 'meatParts', planRub: 50, factRub: 0 },
    { lineId: 'buildings', planRub: 80, factRub: 10 },
  ],
};

function monthDates(month: string): string[] {
  const count = daysInMonth(month);
  return Array.from({ length: count }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`);
}

function eachDate(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (cursor.getTime() <= end.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/** Делит целое на части так, чтобы сумма частей совпала с исходным. */
function distribute(total: number, count: number): number[] {
  if (count <= 0) {
    return [];
  }
  const base = Math.trunc(total / count);
  let remainder = total - base * count;
  return Array.from({ length: count }, () => {
    if (remainder > 0) {
      remainder -= 1;
      return base + 1;
    }
    if (remainder < 0) {
      remainder += 1;
      return base - 1;
    }
    return base;
  });
}

function hireAmount(quantityThousandths: number, unitPriceExVat: number): number {
  return ratioRound(quantityThousandths * unitPriceExVat, QUANTITY_SCALE) ?? 0;
}

function staffFactDates(month: MockMonth, positionId: string): string[] {
  if (month === '2026-11') {
    return monthDates(month).filter((day) => day <= NOVEMBER_FACT_UNTIL);
  }
  const dates = monthDates(month);
  if (month === '2026-10' && positionId === ASSEMBLY_POSITION_ID) {
    return dates.filter((day) => day <= OCTOBER_ASSEMBLY_UNTIL);
  }
  return dates;
}

function staffFactAmounts(month: MockMonth, salaryExVat: number, dates: readonly string[]): number[] {
  if (month === '2026-11') {
    const daily = Math.round(salaryExVat / daysInMonth(month));
    return dates.map(() => daily);
  }
  const total =
    month === '2026-09'
      ? Math.round((salaryExVat * 11) / 10)
      : Math.round((salaryExVat * dates.length) / daysInMonth(month));
  return distribute(total, dates.length);
}

function factFuelExVat(occurredOn: string): number {
  const month = occurredOn.slice(0, 7);
  if (month === '2026-09' || occurredOn < '2026-09-01') {
    return rub(OWN_FACT_FUEL_RUB['2026-09']);
  }
  if (month === '2026-10') {
    return rub(OWN_FACT_FUEL_RUB['2026-10']);
  }
  return rub(OWN_FACT_FUEL_RUB['2026-11']);
}

function isShopPositionId(positionId: string): boolean {
  const position = mockHrPositions.find((item) => item.id === positionId);
  return position ? isHrShopDepartmentId(position.departmentId) : false;
}

function monthOfficeFactAmount(month: MockMonth, salaryExVat: number): number {
  if (month === '2026-09') {
    return Math.round((salaryExVat * 11) / 10);
  }
  if (month === '2026-10') {
    return salaryExVat;
  }
  const dates = staffFactDates(month, '');
  return Math.round(salaryExVat / daysInMonth(month)) * dates.length;
}

export const mockHrMonthPlans: HrMonthPlan[] = MOCK_MONTHS.map((month) => ({
  id: `hr-plan:${month}`,
  month,
  staffLines: STAFF_SEEDS.map((seed) => ({
    id: `hr-plan:${month}:${seed.positionId}`,
    positionId: seed.positionId,
    headcount: 1,
    salaryExVat: rub(seed.salaryRub),
  })),
  outsourcingLines: OUTSOURCING_PLAN.map((seed) => ({
    id: `hr-plan:${month}:out:${seed.departmentId}`,
    departmentId: seed.departmentId,
    hourThousandths: seed.hourThousandths,
    rateExVat: rub(seed.rateRub),
    vatPercent: 20,
  })),
}));

export const mockHrMonthFacts: HrMonthFact[] = MOCK_MONTHS.map((month) => ({
  id: `hr-month-fact:${month}`,
  month,
  staffLines: STAFF_SEEDS.filter((seed) => !isShopPositionId(seed.positionId)).map((seed) => ({
    id: `hr-month-staff:${month}:${seed.positionId}`,
    positionId: seed.positionId,
    headcountThousandths: people(1),
    amountExVat: monthOfficeFactAmount(month, rub(seed.salaryRub)),
  })),
}));

export const mockHrDayFacts: HrDayFact[] = (() => {
  const byDate = new Map<string, HrDayFact>();
  const ensure = (occurredOn: string): HrDayFact => {
    const existing = byDate.get(occurredOn);
    if (existing) {
      return existing;
    }
    const created: HrDayFact = {
      id: `hr-day:${occurredOn}`,
      occurredOn,
      staffLines: [],
      outsourcingLines: [],
    };
    byDate.set(occurredOn, created);
    return created;
  };

  for (const month of MOCK_MONTHS) {
    for (const seed of STAFF_SEEDS.filter((item) => isShopPositionId(item.positionId))) {
      const dates = staffFactDates(month, seed.positionId);
      const amounts = staffFactAmounts(month, rub(seed.salaryRub), dates);
      dates.forEach((occurredOn, index) => {
        ensure(occurredOn).staffLines.push({
          id: `hr-day:${occurredOn}:${seed.positionId}`,
          positionId: seed.positionId,
          headcountThousandths: people(1),
          amountExVat: amounts[index] ?? 0,
        });
      });
    }

    for (const seed of OUTSOURCING_FACT[month]) {
      const dates = SHIPMENT_DAYS[month];
      const hours = distribute(seed.hourThousandths, dates.length);
      const rateExVat = rub(seed.rateRub);
      dates.forEach((occurredOn, index) => {
        ensure(occurredOn).outsourcingLines.push({
          id: `hr-day:${occurredOn}:out:${seed.departmentId}`,
          departmentId: seed.departmentId,
          hourThousandths: hours[index] ?? 0,
          rateExVat,
        });
      });
    }
  }

  return [...byDate.values()].sort((left, right) => left.occurredOn.localeCompare(right.occurredOn));
})();

export const mockHrTaxRates: HrTaxRatesMonth[] = MOCK_MONTHS.map((month) => ({
  id: `hr-tax:${month}`,
  month,
  planNdflHundredths: DEFAULT_NDFL_HUNDREDTHS,
  planSocialHundredths: DEFAULT_SOCIAL_HUNDREDTHS,
  planInjuryHundredths: DEFAULT_INJURY_HUNDREDTHS,
  planOutsourcingVatHundredths: DEFAULT_OUTSOURCING_VAT_HUNDREDTHS,
  factNdflHundredths: DEFAULT_NDFL_HUNDREDTHS,
  factSocialHundredths: DEFAULT_SOCIAL_HUNDREDTHS,
  factInjuryHundredths: DEFAULT_INJURY_HUNDREDTHS,
  factOutsourcingVatHundredths: DEFAULT_OUTSOURCING_VAT_HUNDREDTHS,
}));

export const mockTransportHireMonthPlans: TransportHireMonthPlan[] = MOCK_MONTHS.map((month) => ({
  id: `transport-hire-plan:${month}`,
  month,
  lines: HIRE_SEEDS[month].map((seed) => ({
    id: `transport-hire-plan:${month}:${seed.carrierId}`,
    carrierId: seed.carrierId,
    quantityThousandths: people(seed.plan),
    unitPriceExVat: HIRE_PRICE_KOP[seed.kind],
  })),
}));

export const mockTransportHireDayFacts: TransportHireDayFact[] = (() => {
  const byDate = new Map<string, TransportHireDayFact>();
  for (const month of MOCK_MONTHS) {
    const dates = SHIPMENT_DAYS[month];
    for (const seed of HIRE_SEEDS[month]) {
      const price = HIRE_PRICE_KOP[seed.kind];
      const quantities = distribute(people(seed.fact), dates.length);
      const amounts = distribute(hireAmount(people(seed.fact), price), dates.length);
      dates.forEach((occurredOn, index) => {
        const quantityThousandths = quantities[index] ?? 0;
        if (quantityThousandths === 0) {
          return;
        }
        const day = byDate.get(occurredOn) ?? {
          id: `transport-hire-day:${occurredOn}`,
          occurredOn,
          lines: [],
        };
        day.lines.push({
          id: `transport-hire-day:${occurredOn}:${seed.carrierId}`,
          carrierId: seed.carrierId,
          quantityThousandths,
          amountExVat: amounts[index] ?? 0,
        });
        byDate.set(occurredOn, day);
      });
    }
  }
  return [...byDate.values()].sort((left, right) => left.occurredOn.localeCompare(right.occurredOn));
})();

export const mockTransportOwnMonthPlans: TransportOwnMonthPlan[] = MOCK_MONTHS.map((month) => ({
  id: `transport-own-plan:${month}`,
  month,
  vehicles: MOCK_VEHICLE_IDS.map((vehicleId) => ({
    id: `transport-own-plan:${month}:${vehicleId}`,
    vehicleId,
    litersPer100KmThousandths: OWN_NORM[vehicleId] ?? 0,
    fuelPriceExVat: (OWN_DAILY_KM[vehicleId] ?? 0) === 0 ? 0 : rub(OWN_PLAN_FUEL_RUB),
    planKmThousandths: people((OWN_DAILY_KM[vehicleId] ?? 0) * daysInMonth(month)),
  })),
}));

export const mockTransportOwnDayFacts: TransportOwnDayFact[] = (() => {
  const odometer: Record<string, number> = { ...OWN_ODOMETER_START };
  return eachDate('2026-08-31', NOVEMBER_FACT_UNTIL).map((occurredOn) => {
    const vehicles = (['vehicle-1', 'vehicle-2'] as const).map((vehicleId) => {
      const reading = odometer[vehicleId] ?? 0;
      odometer[vehicleId] = reading + people(OWN_DAILY_KM[vehicleId] ?? 0);
      return {
        id: `transport-own-day:${occurredOn}:${vehicleId}`,
        vehicleId,
        odometerThousandths: reading,
        fuelPriceExVat: factFuelExVat(occurredOn),
      };
    });
    return {
      id: `transport-own-day:${occurredOn}`,
      occurredOn,
      vehicles,
    };
  });
})();

export const mockOpexMonthLines: OpexMonthLines[] = MOCK_MONTHS.map((month) => ({
  id: `opex-lines:${month}`,
  month,
  lines: OTHER_SEEDS[month]
    .filter((seed) => seed.planRub !== 0 || seed.factRub !== 0)
    .map((seed) => ({
      id: `opex-lines:${month}:${seed.lineId}`,
      lineId: seed.lineId,
      planExVat: rub(seed.planRub),
      factExVat: rub(seed.factRub),
    })),
}));
