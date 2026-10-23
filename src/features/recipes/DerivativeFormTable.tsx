'use client';

import { useState } from 'react';
import type { Derivative } from '@/domain/document';
import { MATERIAL_GROUPS, type Material } from '@/domain/document';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  gridFieldClassName,
  keepWithNext,
  MergedTwoStory,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  useOpenCategories,
} from '@/features/table';
import { sanitizeDraft } from '@/features/table/format';

export type DerivativeComponentKind = 'material' | 'derivative';

export type DerivativeLineDraft = {
  quantity: string;
};

export function componentDraftKey(kind: DerivativeComponentKind, id: string): string {
  return `${kind}:${id}`;
}

export function parseComponentDraftKey(key: string): { kind: DerivativeComponentKind; id: string } | null {
  const separator = key.indexOf(':');
  if (separator <= 0) {
    return null;
  }
  const kind = key.slice(0, separator);
  const id = key.slice(separator + 1);
  if ((kind !== 'material' && kind !== 'derivative') || !id) {
    return null;
  }
  return { kind, id };
}

export function emptyDerivativeLineDraft(): DerivativeLineDraft {
  return { quantity: '' };
}

type CandidateRow = {
  key: string;
  kind: DerivativeComponentKind;
  id: string;
  name: string;
  unit: string;
  draft: DerivativeLineDraft;
};

type CandidateGroup = {
  groupId: string;
  groupName: string;
  rows: CandidateRow[];
};

export function DerivativeFormTable({
  materials,
  derivatives,
  drafts,
  onChange,
}: {
  materials: readonly Material[];
  derivatives: readonly Derivative[];
  drafts: Readonly<Record<string, DerivativeLineDraft>>;
  onChange: (key: string, raw: string) => void;
}) {
  const groups = buildGroups(materials, derivatives, drafts);
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Состав производной</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Закладка')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
            </th>
            <th scope="col" className={`${columnHeadingClassName} ${columnDividerClassName}`}>
              <ColumnLabel label="Кол-во" />
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <GroupBlock
              key={group.groupId}
              group={group}
              open={categoryOpen(group.groupId)}
              onToggle={() => toggleCategory(group.groupId)}
              onChange={onChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildGroups(
  materials: readonly Material[],
  derivatives: readonly Derivative[],
  drafts: Readonly<Record<string, DerivativeLineDraft>>,
): CandidateGroup[] {
  const materialGroups = MATERIAL_GROUPS.flatMap((group) => {
    const rows = materials
      .filter((item) => item.groupId === group.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .map((material) => {
        const key = componentDraftKey('material', material.id);
        return {
          key,
          kind: 'material' as const,
          id: material.id,
          name: material.name,
          unit: material.unit,
          draft: drafts[key] ?? emptyDerivativeLineDraft(),
        };
      });

    if (rows.length === 0) {
      return [];
    }

    return [
      {
        groupId: `material:${group.id}`,
        groupName: group.name,
        rows,
      },
    ];
  });

  const derivativeRows = [...derivatives]
    .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
    .map((item) => {
      const key = componentDraftKey('derivative', item.id);
      return {
        key,
        kind: 'derivative' as const,
        id: item.id,
        name: item.name,
        unit: item.unit,
        draft: drafts[key] ?? emptyDerivativeLineDraft(),
      };
    });

  if (derivativeRows.length === 0) {
    return materialGroups;
  }

  return [
    ...materialGroups,
    {
      groupId: 'derivatives',
      groupName: 'Производные',
      rows: derivativeRows,
    },
  ];
}

function GroupBlock({
  group,
  open,
  onToggle,
  onChange,
}: {
  group: CandidateGroup;
  open: boolean;
  onToggle: () => void;
  onChange: (key: string, raw: string) => void;
}) {
  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть позиции группы ${group.groupName}` : `Развернуть позиции группы ${group.groupName}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={onToggle}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {group.groupName} ({group.rows.length})
            </span>
          </div>
        </th>
        <td
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
        />
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <CandidateRowView key={row.key} row={row} index={index + 1} onChange={onChange} />
          ))
        : null}
    </>
  );
}

function CandidateRowView({
  row,
  index,
  onChange,
}: {
  row: CandidateRow;
  index: number;
  onChange: (key: string, raw: string) => void;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="text-sm text-ink">{row.name}</span>
        </div>
      </th>
      <td
        className={`h-px w-px border-b border-b-line p-0 text-right align-middle ${columnDividerClassName} ${cellKindClassName.assigned}`}
      >
        <MergedTwoStory kind="assigned">
          <GridInput
            label={`Количество, ${row.name}`}
            value={row.draft.quantity}
            unit={row.unit}
            onChange={(raw) => onChange(row.key, raw)}
          />
        </MergedTwoStory>
      </td>
    </tr>
  );
}

function GridInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  onChange: (raw: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div data-editable-field="" className="min-w-0">
      <div className="flex items-baseline justify-end gap-1">
        <input
          value={value}
          inputMode="decimal"
          autoComplete="off"
          aria-label={label}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onChange={(event) => onChange(sanitizeDraft(event.target.value, 'decimal'))}
          className={`${gridFieldClassName} text-ink`}
          placeholder={editing || value ? undefined : '—'}
        />
        <span className="shrink-0 text-sm text-ink">{unit}</span>
      </div>
    </div>
  );
}

export function DerivativeFormEmpty() {
  return (
    <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
      Выберите цех — появятся сырьё и производные склада этого цеха.
    </p>
  );
}

export function DerivativeFormNoCandidates() {
  return (
    <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
      На складе этого цеха пока нет сырья и других производных.
    </p>
  );
}
