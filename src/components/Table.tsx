import type { ReactNode } from "react";




export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode; 
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderActions?: (row: T) => ReactNode; 
  keyExtractor: (row: T) => string; 
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  renderActions,
  keyExtractor,
  emptyMessage,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-8 text-2xl shadow shadow-gray-700/50 rounded-xl">{emptyMessage}</p>;
  }

  return (
        <table className="w-full text-left text-sm ">
          <thead>
            <tr className="px-4 py-3  font-semibold uppercase tracking-wide text-gray-800 bg-gray-200/50">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-2 font-semibold text-[15px]">
                  {col.header}
                </th>
              ))}
              {renderActions && <th className="py-4 px-5"></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="border-b border-gray-200 z-0 
               transition-colors duration-150 last:border-b-0 hover:bg-gray-300/30">
                {columns.map((col) => (
                  <td key={col.key} className="text-gray-800 font-semibold text-[15px] px-2 py-1.5" >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {renderActions && <td className="px-2 py-1.5 text-gray-800 font-semibold text-md ">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
  );
}