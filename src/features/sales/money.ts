import { formatRublesFromKopecks } from '@/domain/units';

export function formatMoney(kopecks: number): string {
  return formatRublesFromKopecks(kopecks, true);
}
