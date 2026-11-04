import {
  type HrPosition,
  type PrototypeDocument,
  TRANSPORT_VEHICLE_IDS,
  type TransportCarrier,
} from '@/domain/document';
import { QUANTITY_SCALE } from '@/domain/quantity';

function staff(id: string, departmentId: HrPosition['departmentId'], name: string): HrPosition {
  return { id, departmentId, name, kind: 'staff', deletedAt: null };
}

function outsourcing(departmentId: Exclude<HrPosition['departmentId'], 'admin'>): HrPosition {
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

  staff('hr-meat-foreman', 'meat', 'Бригадир цеха'),
  staff('hr-meat-mince', 'meat', 'Оператор фаршесоставления'),
  staff('hr-meat-former', 'meat', 'Формовщик'),
  staff('hr-meat-heat', 'meat', 'Оператор термообработки'),
  outsourcing('meat'),

  staff('hr-bakery-foreman', 'bakery', 'Бригадир цеха'),
  staff('hr-bakery-dough', 'bakery', 'Оператор тестомеса'),
  staff('hr-bakery-divider', 'bakery', 'Оператор тестоделителя-округлителя'),
  staff('hr-bakery-heat', 'bakery', 'Оператор термообработки'),
  staff('hr-bakery-cool', 'bakery', 'Оператор охлаждения'),
  outsourcing('bakery'),

  staff('hr-veg-operator', 'vegetables', 'Оператор овощного цеха'),
  outsourcing('vegetables'),

  staff('hr-assembly-foreman', 'assembly', 'Бригадир цеха'),
  staff('hr-assembly-line', 'assembly', 'Оператор сборочной линии Крумбайн'),
  staff('hr-assembly-pack', 'assembly', 'Оператор упаковочных машин'),
  staff('hr-assembly-loader', 'assembly', 'Грузчик-сборщик'),
  outsourcing('assembly'),

  staff('hr-dc-chief', 'dc', 'Начальник РЦ'),
  staff('hr-dc-loader', 'dc', 'Грузчик-сборщик'),
  staff('hr-dc-driver', 'dc', 'Водитель Газели'),
  outsourcing('dc'),
];

function carrier(id: string, kind: TransportCarrier['kind'], name: string): TransportCarrier {
  return { id, kind, name, deletedAt: null };
}

/** Именованные контрагенты листа `Transport`. */
export const mockTransportCarriers: TransportCarrier[] = [
  carrier('transport-finished-transsky', 'finishedDelivery', 'Трансскай24'),
  carrier('transport-finished-dial', 'finishedDelivery', 'Диал'),
  carrier('transport-finished-kazachek', 'finishedDelivery', 'Казачек Ф.В.'),
  carrier('transport-finished-kalinov', 'finishedDelivery', 'Калинов А.А.'),
  carrier('transport-finished-klr', 'finishedDelivery', 'КЛР Групп'),
  carrier('transport-transfer-berber', 'finishedTransfer', 'ИП Бербер'),
  carrier('transport-transfer-dial', 'finishedTransfer', 'Диал'),
  carrier('transport-transfer-kalinov', 'finishedTransfer', 'Калинов А.А.'),
  carrier('transport-material-dial', 'materialDelivery', 'Диал'),
  carrier('transport-material-klr', 'materialDelivery', 'КЛР Групп'),
];

/** Пустые планы машин с нормами 17 и 18 л/100 км как в книге. */
export function mockTransportOwnSeedMonth(month: string): PrototypeDocument['transportOwnMonthPlans'][number] {
  return {
    id: `transport-own-plan:${month}`,
    month,
    vehicles: TRANSPORT_VEHICLE_IDS.map((vehicleId, index) => ({
      id: `transport-own-plan:${month}:${vehicleId}`,
      vehicleId,
      litersPer100KmThousandths: index === 0 ? 17 * QUANTITY_SCALE : index === 1 ? 18 * QUANTITY_SCALE : 0,
      fuelPriceExVat: 0,
      planKmThousandths: 0,
    })),
  };
}
