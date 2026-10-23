'use client';

import Link from 'next/link';

import { useDocumentStore } from '@/data/DocumentProvider';
import { derivativeCompositionLines, derivativeSections } from '@/domain/derivatives';
import { derivativeNewHref, RECIPES_DERIVATIVES_TITLE } from '@/features/recipes/paths';
import { RecipeJournalsScreen } from '@/features/recipes/RecipeJournalsScreen';
import { primaryButtonClassName } from '@/features/sales/fields';
import { IconPlus } from '@/features/shell/Icons';

export function DerivativesScreen() {
  const store = useDocumentStore();
  const sections = derivativeSections(store.document).map((section) => ({
    id: section.workshopId,
    name: section.name,
    addHref: derivativeNewHref(section.workshopId),
    items: section.items.map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      components: derivativeCompositionLines(store.document, item).map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        unit: line.unit,
      })),
    })),
  }));

  return (
    <RecipeJournalsScreen
      title={RECIPES_DERIVATIVES_TITLE}
      sections={sections}
      caption="Производные по цехам"
      aside={
        <Link href={derivativeNewHref()} className={primaryButtonClassName}>
          <IconPlus />
          Добавить производную
        </Link>
      }
    />
  );
}
