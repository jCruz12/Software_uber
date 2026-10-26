import React from 'react';
import { Search, X, List, LayoutGrid, AlertCircle, DollarSign, ArrowUpRight, Calculator, Eye, Edit3, Trash2, FileText, Download } from 'lucide-react';

export default function EmployeeDirectory({
  filteredEmployees,
  employees,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  contractFilter,
  setContractFilter,
  viewMode,
  setViewMode,
  computeEarningsSummary,
  toggleEmployeeStatus,
  setViewingEmployee,
  setEarningsModalEmp,
  openEditModal,
  setDeletingEmployeeId,
  renderStatusBadge,
  renderContractBadge,
  setContractModalEmp
}: any) {

  const exportToExcel = () => {
    if (filteredEmployees.length === 0) return;

    const headers = [
      "Empleado",
      "Estado",
      "Tipo Contrato",
      "1er Dia",
      "Seguro Medico (Krankenkasse)",
      "Numero Fiscal (St-Nummer)",
      "Numero Seg. Social (SV-Nummer)",
      "Ganancias Totales (€)",
      "Pago por Banco (€)",
      "Pago en Mano (€)"
    ];

    const rows = filteredEmployees.map((emp: any) => {
      const summary = computeEarningsSummary(emp.id);
      const fullName = `"${emp.lastName}, ${emp.firstName}"`;
      const startDate = emp.startDate ? emp.startDate.substring(0, 10) : '';
      const krankenkasse = `"${emp.krankenkasse || ''}"`;
      const stNummer = `"${emp.stNummer || ''}"`;
      const svNummer = `"${emp.svNummer || ''}"`;

      return [
        fullName,
        emp.status,
        emp.contractType,
        startDate,
        krankenkasse,
        stNummer,
        svNummer,
        (summary?.totalNetEarnings || 0).toFixed(2),
        (summary?.bankTransferAmount || 0).toFixed(2),
        (summary?.cashPaid || 0).toFixed(2)
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Empleados_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 p-4 mb-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Búsqueda global..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 pl-10 pr-4 py-2.5 text-sm text-black border border-transparent focus:bg-white focus:border-black focus:outline-none transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-100 text-xs font-semibold px-3 py-2 focus:outline-none focus:bg-white border border-transparent focus:border-black"
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase">Contrato:</span>
            <select
              value={contractFilter}
              onChange={(e) => setContractFilter(e.target.value)}
              className="bg-gray-100 text-xs font-semibold px-3 py-2 focus:outline-none focus:bg-white border border-transparent focus:border-black"
            >
              <option value="Todos">Todos</option>
              <option value="Minijob">Minijob</option>
              <option value="1/2 Tiempo">1/2 Tiempo</option>
              <option value="No Aplica">No Aplica</option>
            </select>
          </div>

          <div className="flex items-center border border-gray-200 bg-gray-50 p-0.5">
            <button onClick={() => setViewMode('table')} className={`p-1.5 ${viewMode === 'table' ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-3 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 uppercase tracking-wider text-[10px]">
            Resumen Filtrado
          </span>
          <span className="text-gray-700">
            Mostrando <strong className="text-black">{filteredEmployees.length}</strong> empleados en pantalla
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div>
            <span className="text-gray-500 text-[11px]">Suma Nóminas (Filtradas): </span>
            <strong className="text-emerald-900 text-sm font-extrabold font-mono">
              €{filteredEmployees.reduce((acc: number, emp: any) => {
                const summary = computeEarningsSummary(emp.id);
                return acc + (summary?.totalNetEarnings || 0);
              }, 0).toFixed(2)}
            </strong>
          </div>

          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            title="Exportar datos filtrados a Excel (.csv)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center my-8">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black mb-1">No se encontraron registros</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">Verifica los filtros aplicados o agrega un nuevo empleado con el botón superior.</p>
          <button onClick={() => { setSearchTerm(''); setStatusFilter('Todos'); setContractFilter('Todos'); }} className="text-xs font-bold uppercase tracking-wider text-black underline underline-offset-4">
            Limpiar Búsqueda
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead className="bg-black text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5 text-center">Empleado</th>
                  <th className="px-4 py-3.5 text-center">Estado</th>
                  <th className="px-4 py-3.5 text-center">Contrato</th>
                  <th className="px-4 py-3.5 text-center">1er Día</th>
                  <th className="px-4 py-3.5 text-center">Seguro Medico</th>
                  <th className="px-4 py-3.5 text-center">Numero Fiscal </th>
                  <th className="px-4 py-3.5 text-center">Numero Seg. Social</th>
                  <th className="px-4 py-3.5 text-center">Ganancias / Nómina</th>
                  <th className="px-4 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredEmployees.map((emp: any) => {
                  const summary = computeEarningsSummary(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <button onClick={() => setViewingEmployee(emp)} className="font-bold text-gray-900 hover:underline mx-auto block">
                          {emp.lastName}, {emp.firstName}
                        </button>
                        <span className="text-[11px] text-gray-400 block truncate max-w-[200px] mx-auto">
                          {emp.city ? `${emp.city} (${emp.address || ''})` : 'Sin dirección'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center cursor-pointer" onClick={(e) => toggleEmployeeStatus(emp, e)}>
                        {renderStatusBadge(emp.status)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        {renderContractBadge(emp.contractType)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                        {emp.startDate ? emp.startDate.substring(0, 10) : 'Sin asignar'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-800 text-center">
                        {emp.krankenkasse || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                        {emp.stNummer || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                        {emp.svNummer || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => setEarningsModalEmp(emp)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold transition-all"
                        >
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>€{summary.totalNetEarnings.toFixed(2)}</span>
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setEarningsModalEmp(emp)} className="p-1.5 text-emerald-700 hover:bg-emerald-50 transition-all" title="Gestionar Ganancias Excel">
                            <Calculator className="w-4 h-4" />
                          </button>
                          <button onClick={() => setViewingEmployee(emp)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-all" title="Ver Ficha">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setContractModalEmp(emp)} className="p-1.5 text-emerald-800 hover:bg-emerald-50 transition-all" title="Generar Contrato Legal (PDF)">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(emp)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-all" title="Editar">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeletingEmployeeId(emp.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center font-mono">
            <span>Registros mostrados: <strong>{filteredEmployees.length}</strong> / {employees.length}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp: any) => {
            const summary = computeEarningsSummary(emp.id);
            return (
              <div key={emp.id} className="bg-white border border-gray-200 p-6 shadow-sm hover:border-black transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3 cursor-pointer" onClick={(e) => toggleEmployeeStatus(emp, e)}>
                    <span className="font-mono text-xs text-gray-400">ID: {emp.id.substring(0, 6)}...</span>
                    {renderStatusBadge(emp.status)}
                  </div>
                  <h3 onClick={() => setViewingEmployee(emp)} className="text-lg font-bold text-black hover:underline cursor-pointer mb-1">
                    {emp.lastName}, {emp.firstName}
                  </h3>
                  <div className="mb-4">{renderContractBadge(emp.contractType)}</div>

                  <div className="bg-emerald-50/60 border border-emerald-200 p-3 mb-4 rounded-xs">
                    <div className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Ganancias Calculadas Mes</div>
                    <div className="text-xl font-extrabold font-mono text-emerald-900">€{summary.totalNetEarnings.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-700 flex justify-between mt-1 pt-1 border-t border-emerald-200/60">
                      <span>A Nómina: €{summary.bankTransferAmount.toFixed(2)}</span>
                      <span>En Mano: €{summary.cashPaid.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">1er Día:</span><span className="font-mono font-semibold">{emp.startDate ? emp.startDate.substring(0, 10) : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">Krankenkasse:</span><span className="font-semibold text-gray-800">{emp.krankenkasse || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">St-Nummer:</span><span className="font-mono text-gray-700">{emp.stNummer || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">SV-Nummer:</span><span className="font-mono text-gray-700">{emp.svNummer || '-'}</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button onClick={() => setEarningsModalEmp(emp)} className="flex-1 px-3 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calcular Excel</span>
                  </button>
                  <button onClick={() => setViewingEmployee(emp)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase">Ficha</button>
                  <button 
                    onClick={() => setContractModalEmp(emp)} 
                    className="px-3 py-2 bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                    title="Generar Contrato"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Contrato</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}