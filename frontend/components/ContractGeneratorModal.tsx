'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ContractGeneratorModal({
  isOpen,
  onClose,
  employee,
  selectedEmployer
}: {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  selectedEmployer: any;
}) {
  if (!isOpen || !employee) return null;

  const defaultContractType = employee.contractType === '1/2 Tiempo' || employee.contractType === 'Teilzeit' ? 'Teilzeit' : 'Minijob';

  const [contractType, setContractType] = useState<'Teilzeit' | 'Minijob'>(defaultContractType);
  const [startDate, setStartDate] = useState(
    employee.startDate ? employee.startDate.substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  
  const [endDate, setEndDate] = useState('');
  useEffect(() => {
    if (startDate) {
      const d = new Date(startDate);
      d.setFullYear(d.getFullYear() + 1);
      setEndDate(d.toISOString().substring(0, 10));
    }
  }, [startDate]);

  const [contractMonths, setContractMonths] = useState(12);

  const probationDays = Math.round((contractMonths * 42) / 12);
  const probationWeeks = (probationDays / 7).toFixed(1);


  const [isSingleDay, setIsSingleDay] = useState(false); 
  const [weeklyHours, setWeeklyHours] = useState(contractType === 'Teilzeit' ? 25 : 10);
  const [startDay, setStartDay] = useState('Montag');
  const [endDay, setEndDay] = useState('Freitag');
  const [singleDayName, setSingleDayName] = useState('Mittwoch');

  const [dailyHours, setDailyHours] = useState(contractType === 'Teilzeit' ? 5 : 2);
  const [shift1Start, setShift1Start] = useState('08:00');
  const [shift1End, setShift1End] = useState('13:00');

  const [onCallHours, setOnCallHours] = useState(4);

  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    if (contractType === 'Minijob' && weeklyHours > 10) {
      setWeeklyHours(10);
      setDailyHours(2);
    } else if (contractType === 'Teilzeit' && (weeklyHours <= 10 || weeklyHours > 25)) {
      setWeeklyHours(25);
      setDailyHours(5);
    }
  }, [contractType]);

  const totalDailyLoad = Number(dailyHours) + (contractType === 'Minijob' ? Number(onCallHours) : 0);
  const isOverDailyLimit = totalDailyLoad > 10;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white">
      <div className="bg-white text-black w-full max-w-5xl p-6 sm:p-10 border border-gray-400 shadow-2xl relative max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0 print:p-0">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black print:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gray-50 border border-gray-300 p-5 mb-8 print:hidden">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-black flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Configurador Automático de Contrato (Reglas Excel)
            </h3>
            <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">
              {contractType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium mb-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Tipo de Contrato</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full bg-white p-2 border border-gray-300 font-bold focus:outline-none focus:border-black"
              >
                <option value="Minijob">Minijob (≤ 10h/sem)</option>
                <option value="Teilzeit">Teilzeit (&gt; 10h a ≤ 25h/sem)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Fecha de Inicio (§ 1.1)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white p-2 border border-gray-300 font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Duración (Meses)</label>
              <input
                type="number"
                min="1"
                max="24"
                value={contractMonths}
                onChange={(e) => setContractMonths(Number(e.target.value))}
                className="w-full bg-white p-2 border border-gray-300 font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Período de Prueba (§ 1.2)</label>
              <div className="p-2 bg-gray-200 border border-gray-300 font-mono text-xs font-bold">
                {probationDays} días ({probationWeeks} sem.)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium mb-4 pt-3 border-t border-gray-200">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Horas Semanales (§ 3.1)</label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                max={contractType === 'Minijob' ? 10 : 25}
                className="w-full bg-white p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Jornada Laboral</label>
              <select
                value={isSingleDay ? 'single' : 'range'}
                onChange={(e) => setIsSingleDay(e.target.value === 'single')}
                className="w-full bg-white p-2 border border-gray-300 font-bold focus:outline-none focus:border-black"
              >
                <option value="range">Opción A: Rango (ej. Lunes a Viernes)</option>
                <option value="single">Opción B: 1 Solo Día Específico</option>
              </select>
            </div>

            {!isSingleDay ? (
              <>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Desde el día</label>
                  <input
                    type="text"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className="w-full bg-white p-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hasta el día</label>
                  <input
                    type="text"
                    value={endDay}
                    onChange={(e) => setEndDay(e.target.value)}
                    className="w-full bg-white p-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Días de Trabajo Exclusivo (Opción B)</label>
                <input
                  type="text"
                  value={singleDayName}
                  onChange={(e) => setSingleDayName(e.target.value)}
                  placeholder="ej. mittwochs / freitags und samstags"
                  className="w-full bg-white p-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium pt-3 border-t border-gray-200">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Horas Diarias (§ 4.1)</label>
              <input
                type="number"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full bg-white p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>

            {contractType === 'Minijob' && (
              <div>
                <label className="block text-gray-700 font-bold mb-1">Horas Guardia / Rufbereitschaft (§ 4)</label>
                <input
                  type="number"
                  value={onCallHours}
                  onChange={(e) => setOnCallHours(Number(e.target.value))}
                  className="w-full bg-white p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-bold mb-1">Fecha de Firma del Contrato</label>
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="w-full bg-white p-2 border border-gray-300 font-mono focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Alerta de Límite Legal de 10 Horas */}
          {isOverDailyLimit && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-900 text-xs flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>
                ¡ALERTA LEGAL! La suma de horas diarias ({dailyHours}h) y horas de guardia ({onCallHours}h) es de {totalDailyLoad}h, lo cual supera el límite legal alemán de 10 horas diarias máximo.
              </span>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePrint}
              disabled={isOverDailyLimit}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isOverDailyLimit ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white shadow-md'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF Contrato</span>
            </button>
          </div>
        </div>

        <div className="font-serif text-sm leading-relaxed text-black p-4 sm:p-8 border border-gray-200">
          
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-xl font-extrabold uppercase tracking-tight">ARBEITSVERTRAG</h1>
            <p className="text-xs font-sans text-gray-600 mt-1">
              {contractType === 'Teilzeit' 
                ? `(Teilzeit — ${weeklyHours} Stunden/Woche)` 
                : `(Geringfügige Beschäftigung — Minijob, § 8 Abs. 1 Nr. 1 SGB IV — ${weeklyHours} Stunden/Woche)`
              }
            </p>
          </div>

          <div className="mb-6 space-y-3 font-sans text-xs">
            <div>
              <p className="font-bold uppercase text-gray-500 text-[10px]">Zwischen dem Arbeitgeber:</p>
              <p className="font-bold text-sm text-black">{selectedEmployer.name}</p>
              <p className="text-gray-700">{selectedEmployer.address}</p>
            </div>

            <div>
              <p className="font-bold uppercase text-gray-500 text-[10px]">und dem Arbeitnehmer:</p>
              <p className="font-bold text-sm text-black">{employee.lastName}, {employee.firstName}</p>
              <p className="text-gray-700">Geboren am: <span className="font-mono">{employee.birthDate ? employee.birthDate.substring(0, 10) : '-'}</span></p>
              <p className="text-gray-700">Wohnort: {employee.address || '-'}, {employee.zipCode} {employee.city}</p>
            </div>
          </div>

          <div className="space-y-6 text-justify">

            <section>
              <h4 className="font-bold text-sm mb-1.5">§ 1 Beginn und Dauer des Arbeitsverhältnisses</h4>
              <p>
                (1) Das Arbeitsverhältnis beginnt am <strong>{startDate}</strong> und endet am <strong>{endDate}</strong>, ohne dass es einer Kündigung bedarf.
              </p>
              <p className="mt-1">
                (2) Die ersten <strong>{probationWeeks} Wochen</strong> ({probationDays} Kalendertage) gelten als Probezeit. Während der Probezeit kann das Arbeitsverhältnis von beiden Parteien mit einer Frist von zwei Wochen gekündigt werden.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-sm mb-1.5">§ 2 Tätigkeit</h4>
              <p>
                Der Arbeitnehmer wird als Fahrer im Personenbeförderungsgewerbe (Uber Dienstleistungen) eingestellt und entsprechend den betrieblichen Erfordernissen eingesetzt.
              </p>
            </section>
            
            <section>
              <h4 className="font-bold text-sm mb-1.5">§ 3 Arbeitszeit</h4>
              {!isSingleDay ? (
                <p>
                  (1) Die regelmäßige wöchentliche Arbeitszeit beträgt <strong>{weeklyHours} Stunden</strong>, verteilt auf Arbeitstage von {startDay} bis {endDay}.
                </p>
              ) : (
                <p>
                  (1) Die regelmäßige wöchentliche Arbeitszeit beträgt <strong>{weeklyHours} Stunden</strong>. Die Arbeitszeit wird ausschließlich {singleDayName} geleistet.
                </p>
              )}
              <p className="mt-1">
                (2) Die tägliche Arbeitszeit beträgt in der Regel <strong>{dailyHours} Stunden</strong>. Die genaue Lage der Arbeitszeit und der Pausen richtet sich nach den betrieblichen Erfordernissen.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-sm mb-1.5">§ 4 Rufbereitschaft</h4>
              {contractType === 'Minijob' ? (
                <p>
                  Über die vereinbarte regelmäßige Arbeitszeit von {dailyHours} Stunden pro Tag hinaus kann der Arbeitnehmer freiwillig Rufbereitschaft im Umfang von bis zu <strong>{onCallHours} Stunden pro Woche</strong> leisten. Rufbereitschaft im Sinne dieser Vorschrift liegt vor, wenn der Arbeitnehmer sich bereithält, ohne einer konkreten Einsatzpflicht zu unterliegen. (Die Gesamtarbeitszeit überschreitet nicht 10 Stunden täglich).
                </p>
              ) : (
                <p>
                  Außerhalb der in § 3 geregelten Arbeitszeiten kann der Arbeitnehmer freiwillig Rufbereitschaft leisten. Rufbereitschaft im Sinne dieser Vorschrift liegt vor, wenn der Arbeitnehmer sich bereithält, ohne einer konkreten Einsatzpflicht zu unterliegen.
                </p>
              )}
            </section>

            <section>
              <h4 className="font-bold text-sm mb-1.5">§ 5 Vergütung</h4>
              <p>
                Der Arbeitnehmer erhält eine Vergütung gemäß den gesetzlichen Bestimmungen und den individuellen Vereinbarungen.
              </p>
              {contractType === 'Minijob' && (
                <p className="mt-2 text-xs italic bg-gray-50 p-2 border-l-2 border-black">
                  Der Arbeitgeber führt die für die geringfügige Beschäftigung anfallenden Abgaben an die Minijob-Zentrale (Deutsche Rentenversicherung Knappschaft-Bahn-See) ab.
                </p>
              )}
            </section>

          </div>

          <div className="mt-16 pt-8 border-t border-gray-400 font-sans text-xs">
            <p className="mb-8">Musterstadt, den <strong>{signatureDate}</strong></p>
            
            <div className="grid grid-cols-2 gap-12 text-center">
              <div>
                <div className="border-b border-black mb-2 h-16"></div>
                <p className="font-bold">{selectedEmployer.name}</p>
                <p className="text-[10px] text-gray-500">(Arbeitgeber)</p>
              </div>

              <div>
                <div className="border-b border-black mb-2 h-16"></div>
                <p className="font-bold">{employee.lastName}, {employee.firstName}</p>
                <p className="text-[10px] text-gray-500">(Arbeitnehmer)</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}