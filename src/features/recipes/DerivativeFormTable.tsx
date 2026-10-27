'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Derivative } from '@/domain/document';
import { MATERIAL_GROUPS, type Material } from '@/domain/document';
import { fieldClassName } from '@/features/sales/fields';
import { IconChevronDown, IconChevronRight, IconTrash } from '@/features/shell/Icons';
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
};

type CandidateGroup = {
  groupId: string;
  groupName: string;
  rows: CandidateRow[];
};

type SelectedRow = CandidateRow & {
  draft: DerivativeLineDraft;
};

type SelectedGroup = {
  groupId: string;
  groupName: string;
  rows: SelectedRow[];
};

export function buildCandidateGroups(
  materials: readonly Material[],
  derivatives: readonly Derivative[],
): CandidateGroup[] {
  const materialGroups = MATERIAL_GROUPS.flatMap((group) => {
    const rows = materials
      .filter((item) => item.groupId === group.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .map((material) => ({
        key: componentDraftKey('material', material.id),
        kind: 'material' as const,
        id: material.id,
        name: material.name,
        unit: material.unit,
      }));

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
    .map((item) => ({
      key: componentDraftKey('derivative', item.id),
      kind: 'derivative' as const,
      id: item.id,
      name: item.name,
      unit: item.unit,
    }));

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

function selectedGroups(
  materials: readonly Material[],
  derivatives: readonly Derivative[],
  drafts: Readonly<Record<string, DerivativeLineDraft>>,
): SelectedGroup[] {
  return buildCandidateGroups(materials, derivatives).flatMap((group) => {
    const rows = group.rows.flatMap((row) => {
      if (!Object.hasOwn(drafts, row.key)) {
        return [];
      }
      return [
        {
          ...row,
          draft: drafts[row.key] ?? emptyDerivativeLineDraft(),
        },
      ];
    });
    if (rows.length === 0) {
      return [];
    }
    return [{ groupId: group.groupId, groupName: group.groupName, rows }];
  });
}

export function DerivativeCompositionEditor({
  materials,
  derivatives,
  drafts,
  onChange,
  onAdd,
  onRemove,
}: {
  materials: readonly Material[];
  derivatives: readonly Derivative[];
  drafts: Readonly<Record<string, DerivativeLineDraft>>;
  onChange: (key: string, raw: string) => void;
  onAdd: (key: string) => void;
  onRemove: (key: string) => void;
}) {
  const groups = selectedGroups(materials, derivatives, drafts);
  const hasSelected = groups.length > 0;

  return (
    <div className={`flex min-w-0 flex-col gap-3 ${hasSelected ? '' : 'w-[36rem] max-w-full'}`}>
      <RecipeComponentSearch materials={materials} derivatives={derivatives} drafts={drafts} onAdd={onAdd} />
      {hasSelected ? (
        <DerivativeFormTable groups={groups} onChange={onChange} onRemove={onRemove} />
      ) : (
        <p className="w-full border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Добавьте позиции через поиск.
        </p>
      )}
    </div>
  );
}

function DerivativeFormTable({
  groups,
  onChange,
  onRemove,
}: {
  groups: readonly SelectedGroup[];
  onChange: (key: string, raw: string) => void;
  onRemove: (key: string) => void;
}) {
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Состав рецепта</caption>
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
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecipeComponentSearch({
  materials,
  derivatives,
  drafts,
  onAdd,
}: {
  materials: readonly Material[];
  derivatives: readonly Derivative[];
  drafts: Readonly<Record<string, DerivativeLineDraft>>;
  onAdd: (key: string) => void;
}) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const availableGroups = buildCandidateGroups(materials, derivatives)
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => !Object.hasOwn(drafts, row.key)),
    }))
    .filter((group) => group.rows.length > 0);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups =
    normalizedQuery === ''
      ? availableGroups
      : availableGroups
          .map((group) => ({
            ...group,
            rows: group.rows.filter((row) => row.name.toLowerCase().includes(normalizedQuery)),
          }))
          .filter((group) => group.rows.length > 0);

  const hasAnyAvailable = availableGroups.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function selectRow(key: string) {
    onAdd(key);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative z-50 w-full max-w-xl">
      <input
        type="search"
        value={query}
        autoComplete="off"
        aria-label="Найти сырьё или производную"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        role="combobox"
        placeholder="Найти сырьё или производную"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className={fieldClassName}
      />
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Доступные позиции"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto border border-line bg-sheet shadow-sm"
        >
          {!hasAnyAvailable ? (
            <p className="px-3 py-2 text-sm text-muted">Все позиции уже выбраны.</p>
          ) : filteredGroups.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">Ничего не найдено.</p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.groupId}>
                <p className="border-y border-line px-3 py-1.5 text-xs text-muted">{group.groupName}</p>
                {group.rows.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => selectRow(row.key)}
                    className="flex w-full items-baseline justify-between gap-3 border-b border-line px-3 py-2 text-left text-sm text-ink outline-none last:border-b-0 hover:bg-paper focus-visible:bg-paper focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                  >
                    <span>{row.name}</span>
                    <span className="shrink-0 text-muted">{row.unit}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function GroupBlock({
  group,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  group: SelectedGroup;
  open: boolean;
  onToggle: () => void;
  onChange: (key: string, raw: string) => void;
  onRemove: (key: string) => void;
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
            <CandidateRowView key={row.key} row={row} index={index + 1} onChange={onChange} onRemove={onRemove} />
          ))
        : null}
    </>
  );
}

function CandidateRowView({
  row,
  index,
  onChange,
  onRemove,
}: {
  row: SelectedRow;
  index: number;
  onChange: (key: string, raw: string) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="text-sm text-ink">{row.name}</span>
          <button
            type="button"
            aria-label={`Убрать ${row.name} из состава`}
            title="Убрать"
            onClick={() => onRemove(row.key)}
            className="ml-auto inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconTrash />
          </button>
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
