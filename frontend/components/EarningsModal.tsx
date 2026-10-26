import React from 'react';
import { X, Printer, Briefcase, Calendar, ShieldAlert, Receipt, Plus } from 'lucide-react';

export default function EarningsModal({
  earningsModalEmp,
  setEarningsModalEmp,
  selectedEmployer,
  getEmployeeEarningsData,
  computeEarningsSummary,
  updateEmployeeEarningsConfig,
  handleDeleteWeek,
  handleAddWeek,
  newWeek,
  setNewWeek,
  handleDeleteFine,
  handleAddFine,
  newFine,
  setNewFine,
  handlePrintPayroll
}: any) {
  if (!earningsModalEmp) return null;

  const emp = earningsModalEmp;
  const eData = getEmployeeEarningsData(emp.id);
  const summary = computeEarningsSummary(emp.id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white">
      <div className="bg-white text-black w-full max-w-5xl p-4 sm:p-8 border border-gray-400 shadow-2xl relative max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0 print:p-0">
        
        <button 
          onClick={() => setEarningsModalEmp(null)} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black print:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-b border-gray-300 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-2.5 py-1 font-extrabold text-sm tracking-tight">Uber Staff</span>
              <span className="text-xs font-mono uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 font-bold border border-emerald-300">
                Nómina & Ganancias Semanales (DB Connected)
              </span>
            </div>
            
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrintPayroll}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-gray-300 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 border border-gray-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-black">{emp.lastName}, {emp.firstName}</h2>
              <p className="text-xs text-gray-600 font-mono mt-0.5">
                <strong>ID:</strong> {emp.id} | <strong>Dirección:</strong> {emp.address || '-'}, {emp.zipCode} {emp.city}
              </p>
              <p className="text-xs text-gray-600 font-mono">
                <strong>Numero identificacion fiscal:</strong> {emp.stNummer || '-'} | <strong>Número de seguridad social:</strong> {emp.svNummer || '-'}
              </p>
            </div>

            <div className="flex flex-col justify-end text-left md:text-right border-t md:border-t-0 border-gray-200 pt-2 md:pt-0">
              <p className="text-xs font-semibold text-gray-800">
                Empleador: <span className="font-extrabold text-black">{selectedEmployer.name}</span>
              </p>
              <p className="text-xs text-gray-500">{selectedEmployer.address}</p>
              <p className="text-xs font-mono text-emerald-800 font-bold mt-1">
                Seguro medico : {emp.krankenkasse || '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white border border-gray-300 p-4 print:border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Parámetros del Contrato y Porcentajes de Ganancia
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Guardado en DB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Tipo Contrato</label>
              <select
                value={eData.contractType}
                onChange={(e) => updateEmployeeEarningsConfig(emp.id, { contractType: e.target.value })}
                className="w-full bg-gray-100 p-2 border border-gray-300 font-bold focus:outline-none focus:border-black print:bg-transparent print:border-0"
              >
                <option value="Teilzeit">Teilzeit (1/2 Tiempo)</option>
                <option value="Minijob">Minijob</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">% Parte Conductor</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={eData.commissionRate}
                  onChange={(e) => updateEmployeeEarningsConfig(emp.id, { commissionRate: Number(e.target.value) })}
                  className="w-full bg-gray-100 p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black print:bg-transparent"
                  min="0"
                  max="100"
                />
                <span className="font-bold text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Horas Contrato (h/sem)</label>
              <input
                type="number"
                value={eData.contractHours}
                onChange={(e) => updateEmployeeEarningsConfig(emp.id, { contractHours: Number(e.target.value) })}
                className="w-full bg-gray-100 p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black print:bg-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Tarifa Horaria (€/h)</label>
              <input
                type="number"
                step="0.01"
                value={eData.hourlyRate}
                onChange={(e) => updateEmployeeEarningsConfig(emp.id, { hourlyRate: Number(e.target.value) })}
                className="w-full bg-gray-100 p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black print:bg-transparent"
              />
            </div>
          </div>

          {eData.contractType === 'Teilzeit' && (
            <div className="mt-3 p-2.5 bg-gray-100 border-l-4 border-black text-xs font-mono flex justify-between items-center">
              <span>Base teórica según contrato ({eData.contractHours}h x 4.33 sem x €{eData.hourlyRate}/h):</span>
              <strong className="text-black font-extrabold text-sm">€{summary.monthlyContractBasePay.toFixed(2)}</strong>
            </div>
          )}
        </div>

        <div className="mb-6 bg-white border border-gray-300 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black" />
              Detalle de Semanas de Trabajo (Kalenderwoche - KW)
            </h3>
            <span className="text-xs font-mono font-semibold text-emerald-800">
              Semanas registradas: {summary.calculatedWeeks.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse border border-gray-300">
              <thead className="bg-black text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2 border border-gray-800">KW</th>
                  <th className="p-2 border border-gray-800">Fechas</th>
                  <th className="p-2 border border-gray-800">Fahrtpreis (€)</th>
                  <th className="p-2 border border-gray-800">Aktion (€)</th>
                  <th className="p-2 border border-gray-800">Comisión Serv. (€)</th>
                  <th className="p-2 border border-gray-800 bg-gray-800">Total Net Viajes (€)</th>
                  <th className="p-2 border border-gray-800 bg-emerald-900">{eData.commissionRate}% Conductor (€)</th>
                  <th className="p-2 border border-gray-800">Propina (€)</th>
                  <th className="p-2 border border-gray-800 bg-emerald-950">Total Semanal (€)</th>
                  <th className="p-2 border border-gray-800 print:hidden">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.calculatedWeeks.map((w: any) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-200 font-bold text-black">{w.kw}</td>
                    <td className="p-2 border border-gray-200 text-gray-600">{w.dateRange}</td>
                    <td className="p-2 border border-gray-200">€{Number(w.fahrtpreis).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 text-emerald-700">€{Number(w.aktion).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 text-red-600">-€{Number(w.serviceFee).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 font-bold bg-gray-50">€{w.tripNetTotal.toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 font-bold text-emerald-800 bg-emerald-50/50">
                      €{w.driverShare.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-200">€{Number(w.tip).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 font-extrabold text-black bg-gray-100">
                      €{w.weekTotal.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-200 text-center print:hidden">
                      <button
                        onClick={() => handleDeleteWeek(emp.id, w.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Eliminar semana"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-100 font-extrabold text-black">
                <tr>
                  <td colSpan={2} className="p-2 border border-gray-300 text-right uppercase text-[10px]">Totales Mes:</td>
                  <td className="p-2 border border-gray-300">€{summary.totalFahrtpreis.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 text-emerald-800">€{summary.totalAktion.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 text-red-600">-€{summary.totalServiceFee.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 bg-gray-200">€{summary.gesamtBruttoTrips.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 bg-emerald-100 text-emerald-900">€{summary.totalDriverCommission.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300">€{summary.totalTips.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 bg-black text-white">€{summary.totalGrossDriverEarnings.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300 print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <form onSubmit={(e) => handleAddWeek(emp.id, e)} className="mt-4 pt-3 border-t border-gray-200 bg-gray-50 p-3 print:hidden">
            <div className="text-[11px] font-bold text-gray-700 uppercase mb-2">Agregar Nueva Semana (KW) a la Base de Datos</div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
              <input
                type="text"
                placeholder="KW (ej. KW 39)"
                value={newWeek.kw}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, kw: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
                required
              />
              <input
                type="text"
                placeholder="Fechas (22.09 - 28.09)"
                value={newWeek.dateRange}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, dateRange: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Fahrtpreis €"
                value={newWeek.fahrtpreis}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, fahrtpreis: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Aktion €"
                value={newWeek.aktion}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, aktion: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Servicio €"
                value={newWeek.serviceFee}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, serviceFee: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Propina €"
                value={newWeek.tip}
                onChange={(e) => setNewWeek((prev: any) => ({ ...prev, tip: e.target.value }))}
                className="p-1.5 bg-white border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 uppercase tracking-wider flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Semana en BD</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <div className="bg-white border border-gray-300 p-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Descuentos, Multas y Aktenzeichen
            </h3>

            {(eData.fines || []).length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">Sin multas o descuentos registrados en la BD.</p>
            ) : (
              <div className="space-y-2 mb-4 font-mono text-xs">
                {(eData.fines || []).map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between bg-red-50/60 p-2 border border-red-200 text-red-900">
                    <div>
                      <div className="font-bold">{f.description}</div>
                      <div className="text-[10px] text-red-700">AZ: {f.aktenzeichen} | PIN: {f.pin}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-red-700">-€{Number(f.amount).toFixed(2)}</span>
                      <button onClick={() => handleDeleteFine(emp.id, f.id)} className="text-red-400 hover:text-red-800 print:hidden">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={(e) => handleAddFine(emp.id, e)} className="bg-gray-50 p-3 border border-gray-200 text-xs print:hidden space-y-2">
              <div className="font-bold text-gray-700 text-[10px] uppercase">Registrar Multa / Descuento en BD</div>
              <input
                type="text"
                placeholder="Descripción de infracción"
                value={newFine.description}
                onChange={(e) => setNewFine((prev: any) => ({ ...prev, description: e.target.value }))}
                className="w-full p-1.5 bg-white border border-gray-300"
                required
              />
              <div className="grid grid-cols-3 gap-2 font-mono">
                <input
                  type="text"
                  placeholder="Aktenzeichen"
                  value={newFine.aktenzeichen}
                  onChange={(e) => setNewFine((prev: any) => ({ ...prev, aktenzeichen: e.target.value }))}
                  className="p-1.5 bg-white border border-gray-300 text-[11px]"
                />
                <input
                  type="text"
                  placeholder="PIN"
                  value={newFine.pin}
                  onChange={(e) => setNewFine((prev: any) => ({ ...prev, pin: e.target.value }))}
                  className="p-1.5 bg-white border border-gray-300 text-[11px]"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Monto €"
                  value={newFine.amount}
                  onChange={(e) => setNewFine((prev: any) => ({ ...prev, amount: e.target.value }))}
                  className="p-1.5 bg-white border border-gray-300 text-[11px]"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white py-1.5 font-bold uppercase text-[10px]">
                Guardar Descuento en BD
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-300 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Ajustes de Liquidación y Desglose de Pago
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Provisión Vacaciones / Ajuste Mes (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={eData.vacationProvision || 0}
                    onChange={(e) => updateEmployeeEarningsConfig(emp.id, { vacationProvision: Number(e.target.value) })}
                    className="w-full bg-gray-100 p-2 border border-gray-300 font-mono font-bold text-black focus:outline-none focus:border-black print:bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1">Monto Pagado "En Mano" (Efectivo €)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={eData.cashPaidInHand || 0}
                    onChange={(e) => updateEmployeeEarningsConfig(emp.id, { cashPaidInHand: Number(e.target.value) })}
                    className="w-full bg-gray-100 p-2 border border-gray-300 font-mono font-bold text-black focus:outline-none focus:border-black print:bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-900 text-white font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Ganado Conductor:</span>
                <span>€{summary.totalGrossDriverEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Deducciones (Multas + Vac.):</span>
                <span>-€{summary.totalDeductions.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm border-t border-gray-700 pt-1 text-emerald-400">
                <span>LÍQUIDO A RECIBIR:</span>
                <span>€{summary.totalNetEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-black text-white p-6 border border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">
              Resumen Final de Liquidación
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
              €{summary.bankTransferAmount.toFixed(2)}
            </div>
            <p className="text-xs text-gray-300 mt-1 font-mono">
              Monto neto final a transferir por cuenta bancaria (Nómina).
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
            <div className="bg-gray-900 px-4 py-2 border border-gray-800">
              <span className="text-gray-400 block text-[10px]">PAGADO EN MANO</span>
              <strong className="text-white text-base">€{summary.cashPaid.toFixed(2)}</strong>
            </div>
            <div className="bg-gray-900 px-4 py-2 border border-gray-800">
              <span className="text-gray-400 block text-[10px]">TOTAL DESCUENTOS</span>
              <strong className="text-red-400 text-base">€{summary.totalDeductions.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-xs font-mono">
          <div className="grid grid-cols-2 gap-12 text-center">
            <div>
              <div className="border-b border-black mb-2 h-12"></div>
              <p className="font-bold">Firma del Empleador</p>
              <p className="text-[10px] text-gray-500">{selectedEmployer.name}</p>
            </div>
            <div>
              <div className="border-b border-black mb-2 h-12"></div>
              <p className="font-bold">Firma del Conductor / Empleado</p>
              <p className="text-[10px] text-gray-500">{emp.lastName}, {emp.firstName}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}