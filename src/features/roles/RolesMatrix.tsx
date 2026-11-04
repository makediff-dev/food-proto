import { PERMISSION_MATRIX_ROWS, permissionAllowed, ROLES } from '@/features/roles/roles';
import { IconCheck, IconCross } from '@/features/shell/Icons';

export function RolesMatrix() {
  return (
    <div className="overflow-x-auto border border-line bg-sheet">
      <table className="w-full min-w-max border-collapse text-sm">
        <caption className="sr-only">Права ролей просмотра</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-3 py-2 text-left font-normal text-muted">
              Право
            </th>
            {ROLES.map((role) => (
              <th key={role.id} scope="col" className="px-3 py-2 text-center font-normal text-ink">
                {role.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_MATRIX_ROWS.map((row) => (
            <tr
              key={row.kind === 'section' ? `section:${row.section}` : `flag:${row.key}`}
              className="border-b border-line last:border-b-0"
            >
              <th scope="row" className="px-3 py-2 text-left font-normal text-ink">
                {row.label}
              </th>
              {ROLES.map((role) => {
                const allowed = permissionAllowed(role, row);
                return (
                  <td key={role.id} className="px-3 py-2 text-center">
                    {allowed ? (
                      <span className="inline-flex items-center justify-center text-positive" title="да">
                        <span className="sr-only">да</span>
                        <IconCheck />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center text-negative" title="нет">
                        <span className="sr-only">нет</span>
                        <IconCross />
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
