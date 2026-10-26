import React from 'react';
import { X, Calculator } from 'lucide-react';

export default function EmployeeViewModal({ viewingEmployee, setViewingEmployee, selectedEmployer, renderStatusBadge, renderContractBadge, setEarningsModalEmp, openEditModal }: any) {
  if (!viewingEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black w-full max-w-2xl p-6 sm:p-8 border border-gray-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setViewingEmployee(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-black text-white text-xs font-mono px-2 py-0.5">Empleador: {selectedEmployer.name}</span>
          {renderStatusBadge(viewingEmployee.status)}
          {renderContractBadge(viewingEmployee.contractType)}
        </div>
        <h2 className="text-2xl font-extrabold text-black mb-6">{viewingEmployee.lastName}, {viewingEmployee.firstName}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Primer Día de Trabajo</span><span className="font-mono font-bold text-sm text-black">{viewingEmployee.startDate ? viewingEmployee.startDate.substring(0, 10) : '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Fecha de Nacimiento</span><span className="font-mono font-bold text-sm text-black">{viewingEmployee.birthDate ? viewingEmployee.birthDate.substring(0, 10) : '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Krankenkasse (Caja Salud)</span><span className="font-semibold text-sm text-black">{viewingEmployee.krankenkasse || '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Empleo Marginal</span><span className="font-semibold text-sm text-black">{viewingEmployee.marginalEmp || '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Número Fiscal (St-Nummer)</span><span className="font-mono font-bold text-sm text-black">{viewingEmployee.stNummer || '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">N.º Seguridad Social (SV-Nummer)</span><span className="font-mono font-bold text-sm text-black">{viewingEmployee.svNummer || '-'}</span></div>
          <div className="bg-gray-50 p-3.5 border border-gray-100 sm:col-span-2"><span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Dirección y Ciudad</span><span className="font-medium text-sm text-black">{viewingEmployee.address || ''}, {viewingEmployee.zipCode || ''} {viewingEmployee.city || ''}</span></div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => { setEarningsModalEmp(viewingEmployee); setViewingEmployee(null); }} className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadora Excel</span>
          </button>
          <button onClick={() => { const emp = viewingEmployee; setViewingEmployee(null); openEditModal(emp); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider text-black">Editar</button>
          <button onClick={() => setViewingEmployee(null)} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider">Cerrar</button>
        </div>
      </div>
    </div>
  );
}