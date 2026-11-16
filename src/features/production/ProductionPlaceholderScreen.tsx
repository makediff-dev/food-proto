import { PageFrame } from '@/features/shell/PageFrame';

export function ProductionPlaceholderScreen({ title, upcoming }: { title: string; upcoming: string }) {
  return (
    <PageFrame title={title}>
      <div className="border border-line bg-sheet px-4 py-4">
        <p className="text-sm text-ink">Раздел в разработке.</p>
        <p className="mt-2 text-sm leading-6 text-muted">{upcoming}</p>
      </div>
    </PageFrame>
  );
}
