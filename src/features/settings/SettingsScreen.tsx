'use client';

import { type ChangeEvent, useRef, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { downloadDocumentFile, parseDocumentFile } from '@/data/document-file';
import { ROLES_TITLE } from '@/features/roles/paths';
import { useRole } from '@/features/roles/RoleProvider';
import { RolesMatrix } from '@/features/roles/RolesMatrix';
import { isRoleId, ROLES } from '@/features/roles/roles';
import { SETTINGS_TITLE } from '@/features/settings/paths';
import { IconDownload, IconUndo, IconUpload } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function SettingsScreen() {
  return (
    <PageFrame title={SETTINGS_TITLE} lede="Роль просмотра, обмен файлами данных и матрица прав." wide>
      <div className="flex flex-col gap-8">
        <RoleSection />
        <MockSection />
        <section className="flex flex-col gap-3">
          <h2 className="font-figure text-lg leading-tight tracking-tight text-ink">{ROLES_TITLE}</h2>
          <RolesMatrix />
        </section>
      </div>
    </PageFrame>
  );
}

function RoleSection() {
  const { roleId, setRole } = useRole();
  const fieldId = 'settings-role';

  return (
    <section className="flex max-w-md flex-col gap-2">
      <h2 className="font-figure text-lg leading-tight tracking-tight text-ink">Роль</h2>
      <label htmlFor={fieldId} className="text-sm leading-5 text-muted">
        Без реального входа: меню и ввод режутся по выбранной роли.
      </label>
      <select
        id={fieldId}
        value={roleId}
        onChange={(event) => {
          const next = event.target.value;
          if (isRoleId(next)) {
            setRole(next);
          }
        }}
        className="h-11 w-full border border-line bg-sheet px-3 text-sm text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {ROLES.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label}
          </option>
        ))}
      </select>
    </section>
  );
}

function MockSection() {
  const { document, source, hydrated, storageError, replaceDocument, resetToMock } = useDocumentStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileFeedback, setFileFeedback] = useState<{
    kind: 'error' | 'notice';
    message: string;
  } | null>(null);
  const usingLocalData = source === 'local';

  function handleDownload() {
    setFileFeedback(null);
    downloadDocumentFile(document);
  }

  function handleOpenFilePicker() {
    setFileFeedback(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    let raw: string;
    try {
      raw = await file.text();
    } catch {
      setFileFeedback({
        kind: 'error',
        message: 'Не удалось прочитать выбранный файл.',
      });
      return;
    }

    const parsed = parseDocumentFile(raw);
    if (!parsed.ok) {
      setFileFeedback({
        kind: 'error',
        message: parsed.error,
      });
      return;
    }

    if (usingLocalData) {
      const confirmed = window.confirm(
        `Загрузить данные из файла «${file.name}»? Текущие записи в этом браузере будут заменены.`,
      );
      if (!confirmed) {
        return;
      }
    }

    replaceDocument(parsed.document);
    setFileFeedback({
      kind: 'notice',
      message: `Данные загружены из файла «${file.name}».`,
    });
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Вернуть мок-данные? Все записи в этом браузере будут стёрты. Останется гамбургер и план сентября.',
    );
    if (!confirmed) {
      return;
    }

    setFileFeedback(null);
    resetToMock();
  }

  return (
    <section className="flex max-w-md flex-col gap-2">
      <h2 className="font-figure text-lg leading-tight tracking-tight text-ink">Данные</h2>
      <p className="text-sm leading-5 text-muted" role={storageError ? 'alert' : undefined}>
        {storageError ?? (usingLocalData ? 'Сохранено в этом браузере.' : 'Показаны мок-данные.')}
      </p>
      {fileFeedback ? (
        <p
          className={fileFeedback.kind === 'error' ? 'text-sm leading-5 text-ink' : 'text-sm leading-5 text-muted'}
          role={fileFeedback.kind === 'error' ? 'alert' : 'status'}
        >
          {fileFeedback.message}
        </p>
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
        aria-label="Файл данных JSON"
      />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!hydrated}
          className="inline-flex h-11 w-full items-center justify-center gap-2 border border-ink bg-ink px-3 text-sm text-sheet outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-sheet disabled:text-muted"
        >
          <IconDownload />
          Скачать данные (JSON)
        </button>
        <button
          type="button"
          onClick={handleOpenFilePicker}
          disabled={!hydrated}
          className="inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:text-muted"
        >
          <IconUpload />
          Загрузить данные из JSON
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hydrated || !usingLocalData}
          className="inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:text-muted"
        >
          <IconUndo />
          Вернуть мок-данные
        </button>
      </div>
    </section>
  );
}
