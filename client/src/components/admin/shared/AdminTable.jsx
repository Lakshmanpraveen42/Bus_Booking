import React from 'react';

/**
 * A reusable, production-ready Table component for Admin modules.
 * Supports custom rendering, column alignment, and empty states.
 */
const AdminTable = ({ 
  columns = [], 
  data = [], 
  loading = false, 
  emptyMessage = "No records found in database" 
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={[
                    "px-8 py-6",
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  ].join(' ')}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              // Enhanced Loading State
              <tr>
                <td colSpan={columns.length} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              // Enhanced Empty State
              <tr>
                <td colSpan={columns.length} className="px-8 py-24 text-center">
                   <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className="group hover:bg-slate-50/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${rowIdx * 50}ms` }}
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={[
                        "px-8 py-6",
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      ].join(' ')}
                    >
                      <div className="animate-in fade-in">
                        {col.render ? col.render(row, rowIdx) : (
                          <span className="text-sm font-bold text-slate-600">{row[col.key]}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
