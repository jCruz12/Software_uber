import React from 'react';
import { FileSpreadsheet, Calculator } from 'lucide-react';

export default function EarningsGlobalView({ employees, computeEarningsSummary, getEmployeeEarningsData, setEarningsModalEmp }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-black mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          Resumen General de Cálculo de Ganancias (Semanas KW & Porcentajes)
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Selecciona un empleado para abrir su hoja de cálculo interactiva completa, ajustar tarifas (ej. 40%, Teilzeit 30h/13.90€), agregar semanas (Fahrtpreis, Aktion) y calcular retenciones o multas guardadas en Neon DB.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp: any) => {
            const summary = computeEarningsSummary(emp.id);
            const eData = getEmployeeEarningsData(emp.id);
            return (
              <div key={emp.id} className="border border-gray-200 bg-gray-50/50 p-4 hover:border-black transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-extrabold text-black text-sm">{emp.lastName}, {emp.firstName}</h4>
                    <span className="text-[11px] text-gray-500">{emp.contractType || 'Minijob'}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 font-bold">
                    {eData.commissionRate || 40}% Com.
                  </span>
                </div>

                <div className="space-y-1 my-3 text-xs font-mono">
                  <div className="flex justify-between text-gray-600">
                    <span>Semanas cargadas:</span>
                    <strong>{summary.calculatedWeeks.length} W</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Bruto Viajes (Trip Net):</span>
                    <span>€{summary.gesamtBruttoTrips.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Parte Conductor ({eData.commissionRate}%):</span>
                    <span>€{summary.totalDriverCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Propinas:</span>
                    <span>€{summary.totalTips.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 border-t border-gray-200 pt-1">
                    <span>Multas / Descuentos:</span>
                    <span>-€{summary.totalFines.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 p-2.5 mb-3">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Monto Final A Transferir (Nómina)</div>
                  <div className="text-lg font-extrabold font-mono text-emerald-800">
                    €{summary.bankTransferAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-600 font-mono">
                    Pagado en mano: €{summary.cashPaid.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => setEarningsModalEmp(emp)}
                  className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abrir Calculadora Individual</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}