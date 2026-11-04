'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { ROLES_TITLE } from '@/features/roles/paths';
import { useRole } from '@/features/roles/RoleProvider';
import { RolesMatrix } from '@/features/roles/RolesMatrix';
import { isRoleId, ROLES } from '@/features/roles/roles';
import { SETTINGS_TITLE } from '@/features/settings/paths';
import { IconUndo } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function SettingsScreen() {
  return (
    <PageFrame title={SETTINGS_TITLE} lede="Роль просмотра, сброс данных браузера и матрица прав." wide>
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
  const { source, hydrated, storageError, resetToMock } = useDocumentStore();
  const usingLocalData = source === 'local';

  function handleReset() {
    const confirmed = window.confirm(
      'Вернуть мок-данные? Все записи в этом браузере будут стёрты. Останется гамбургер и план сентября.',
    );
    if (!confirmed) {
      return;
    }

    resetToMock();
  }

  return (
    <section className="flex max-w-md flex-col gap-2">
      <h2 className="font-figure text-lg leading-tight tracking-tight text-ink">Данные</h2>
      <p className="text-sm leading-5 text-muted" role={storageError ? 'alert' : undefined}>
        {storageError ?? (usingLocalData ? 'Сохранено в этом браузере.' : 'Показаны мок-данные.')}
      </p>
      <button
        type="button"
        onClick={handleReset}
        disabled={!hydrated || !usingLocalData}
        className="inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:text-muted"
      >
        <IconUndo />
        Вернуть мок-данные
      </button>
    </section>
  );
}
