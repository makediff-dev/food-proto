import { PageFrame } from '@/features/shell/page-frame';

export function ProductionPlaceholderScreen({
  title,
  lede,
  upcoming,
}: {
  title: string;
  lede: string;
  upcoming: string;
}) {
  return (
    <PageFrame title={title} lede={lede}>
      <div className="border border-line bg-sheet px-4 py-4">
        <p className="text-sm text-ink">Раздел в разработке.</p>
        <p className="mt-2 text-sm leading-6 text-muted">{upcoming}</p>
      </div>
    </PageFrame>
  );
}
