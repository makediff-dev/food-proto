/** Предлоги, союзы и частицы, которые не оставляют в конце строки. */
const HANGING_WORDS = new Set([
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'с',
  'со',
  'у',
]);

export function keepWithNext(text: string): string {
  const parts = text.split(' ');
  let line = '';
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? '';
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? '').toLowerCase().replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, '');
    line += HANGING_WORDS.has(bare) ? '\u00A0' : ' ';
  }
  return line;
}

const columnHeadingHintClassName =
  'pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 hidden w-max max-w-[14rem] -translate-x-1/2 rounded border border-line bg-paper px-2 py-1 text-left text-xs font-normal normal-case leading-snug text-ink shadow-sm group-hover:block';

export function ColumnLabel({ label, hint }: { label: string; hint?: string }) {
  const chunks = keepWithNext(label).split(' ');
  const labelContent = (
    <span className={`mx-auto block w-min text-center ${hint ? 'border-b border-dotted border-muted' : ''}`}>
      {chunks.map((chunk) => (
        <span key={chunk} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );

  if (!hint) {
    return labelContent;
  }

  return (
    <span className="group relative mx-auto block w-min cursor-help">
      {labelContent}
      <span role="tooltip" className={columnHeadingHintClassName}>
        {keepWithNext(hint)}
      </span>
    </span>
  );
}
