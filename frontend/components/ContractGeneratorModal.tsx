'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, FileText, ShieldAlert } from 'lucide-react';

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

  const [weeklyHours, setWeeklyHours] = useState(contractType === 'Teilzeit' ? 30 : 10);
  const [startDay, setStartDay] = useState('Montag');
  const [endDay, setEndDay] = useState('Freitag');
  const [dailyHours, setDailyHours] = useState(contractType === 'Teilzeit' ? 6 : 2);
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    if (contractType === 'Minijob' && weeklyHours > 10) {
      setWeeklyHours(10);
      setDailyHours(2);
    } else if (contractType === 'Teilzeit' && (weeklyHours <= 10 || weeklyHours > 30)) {
      setWeeklyHours(30);
      setDailyHours(6);
    }
  }, [contractType]);

  const handlePrint = () => {
    window.print();
  };

  return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 print:fixed print:inset-0 print:bg-white print:p-0 print:m-0 print:z-[9999]">
        <div className="bg-white text-black w-full max-w-5xl p-6 sm:p-10 border border-gray-400 shadow-2xl relative max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0 print:p-8 print:w-full print:max-w-none print:overflow-visible">
    
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
              Generador de Contrato Oficial (Formato Alemán con Notas)
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
                <option value="Minijob">Minijob (Geringfügige Beschäftigung)</option>
                <option value="Teilzeit">Teilzeit (30 Stunden/Woche)</option>
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
              <label className="block text-gray-700 font-bold mb-1">Horas Semanales (§ 3.1)</label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full bg-white p-2 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-black hover:bg-gray-800 text-white shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar Contrato PDF</span>
            </button>
          </div>
        </div>

        <div id="contract-document" className="font-serif text-sm leading-relaxed text-black p-4 sm:p-8 border border-gray-200 space-y-6 print:p-0 print:border-0">
          
          <div className="text-center mb-6 pb-4 border-b-2 border-black">
            <h1 className="text-xl font-extrabold uppercase tracking-tight">ARBEITSVERTRAG</h1>
            <p className="text-xs font-sans text-gray-600 mt-1">
              ({contractType === 'Teilzeit' ? 'Teilzeit — 30 Stunden/Woche' : 'Geringfügige Beschäftigung — Minijob, § 8 Abs. 1 Nr. 1 SGB IV — 30 Stunden/Woche'})
            </p>
          </div>

          <div className="space-y-2 font-sans text-xs">
            <p className="font-bold uppercase text-gray-500 text-[10px]">Zwischen</p>
            <p className="font-bold text-sm text-black">Luis Jorge Gama Maldonado, Jahnstraße 20, 68535 Edingen-Neckarhausen,</p>
            <p className="italic text-gray-600">— nachfolgend „Arbeitgeber“ genannt —</p>
            <p className="font-bold uppercase text-gray-500 text-[10px] pt-2">und</p>
            <p className="font-bold text-sm text-black">{employee.lastName}, {employee.firstName},</p>
            <p className="text-gray-700">Geboren am: <span className="font-mono">{employee.birthDate ? employee.birthDate.substring(0, 10) : '—'}</span>,</p>
            <p className="text-gray-700">wohnhaft {employee.address || '—'}, {employee.zipCode || ''} {employee.city || ''}</p>
            <p className="italic text-gray-600">— nachfolgend „Arbeitnehmer“ genannt —</p>
            <p className="pt-2">wird folgender Arbeitsvertrag geschlossen:</p>
          </div>

          {/* § 1 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 1 Beginn und Dauer des Arbeitsverhältnisses</h4>
            <p>
              (1) Das Arbeitsverhältnis beginnt am <strong>{startDate}</strong> und ist bis zum <strong>{endDate}</strong> befristet (§ 14 Abs. 2 TzBfG — sachgrundlose Befristung). Eine Verlängerung bedarf der Schriftform. Die Parteien bestätigen, dass zwischen ihnen zuvor kein Arbeitsverhältnis bestanden hat (Voraussetzung der wirksamen sachgrundlosen Befristung, § 14 Abs. 2 S. 2 TzBfG).
            </p>
            <p>
              (2) Die ersten <strong>{probationWeeks} Wochen</strong> ({probationDays} Kalendertage) gelten als Probezeit. Während der Probezeit kann das Arbeitsverhältnis von beiden Seiten mit einer Frist von zwei Wochen gekündigt werden.
            </p>
            <p>(3) Nach Ablauf der Probezeit gelten die gesetzlichen Kündigungsfristen.</p>
          </section>

          {/* § 2 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 2 Tätigkeit</h4>
            <p>(1) Der Arbeitnehmer wird als Fahrer im Mietwagengewerbe gemäß § 49 PBefG eingestellt.</p>
            <p>(2) Der Arbeitnehmer ist verpflichtet, das Fahrzeug nach Abschluss jedes Auftrags unverzüglich zum Betriebssitz zurückzuführen (Rückkehrpflicht, § 49 Abs. 4 PBefG). Eine Mitnahme von Fahrgästen ohne registrierten Auftrag ist untersagt.</p>
            <p>(3) Der Arbeitgeber ist berechtigt, dem Arbeitnehmer zumutbare andere oder weitergehende Tätigkeiten zu übertragen, soweit diese seiner Qualifikation entsprechen.</p>
            <p>(4) Der Arbeitnehmer verpflichtet sich, stets im Besitz einer gültigen Fahrerlaubnis sowie eines gültigen P-Scheins zu sein und diese dem Arbeitgeber auf Verlangen vorzulegen. Der Verlust oder die Einschränkung der Fahrerlaubnis ist dem Arbeitgeber unverzüglich mitzuteilen.</p>
          </section>

          {/* § 3 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 3 Arbeitszeit</h4>
            <p>
              (1) Die regelmäßige wöchentliche Arbeitszeit beträgt <strong>{weeklyHours} Stunden</strong> ({contractType}), verteilt auf fünf Arbeitstage von {startDay} bis {endDay}.
            </p>
            <p>(2) Die tägliche Arbeitszeit beträgt in der Regel {dailyHours} Stunden.</p>
            <p>(3) Beginn und Ende der Arbeitszeit sowie Pausen werden vom Arbeitnehmer im Arbeitszeiterfassungsformular dokumentiert. Der Arbeitgeber gleicht diese Aufzeichnungen monatlich mit den Plattformdaten ab.</p>
            <p>(4) Die Höchstarbeitszeit von acht Stunden werktäglich darf nur nach Maßgabe des § 3 ArbZG überschritten werden. Überstunden bedürfen der vorherigen Anordnung durch den Arbeitgeber und werden vorrangig durch Freizeit in gleicher Höhe ausgeglichen.</p>
            <p>(5) Über die regelmäßige Arbeitszeit hinausgehende freiwillige Fahrdienste an Wochenenden richten sich nach den Bedingungen der Rufbereitschaft (§ 4).</p>
          </section>

          {/* § 4 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 4 Rufbereitschaft</h4>
            <p>
              (1) Außerhalb der in § 3 geregelten Arbeitszeiten kann der Arbeitnehmer freiwillig Rufbereitschaft leisten. Rufbereitschaft im Sinne dieser Vorschrift liegt vor, wenn der Arbeitnehmer sich bereithält, ohne einer konkreten Einsatzpflicht zu unterliegen.
            </p>
            <p>
              (2) Während der Rufbereitschaft gilt: Der Arbeitnehmer ist nicht verpflichtet, die Vermittlungsapp zu nutzen, unterliegt keiner Mindestannahmequote, ist an kein bestimmtes geographisches Gebiet gebunden und kann Aufträge nach freiem Ermessen ablehnen.
            </p>
            <p>(3) Sanktionen — weder vertragliche noch faktische — werden an die Ablehnungsrate oder die Häufigkeit der Offline-Präsenz nicht geknüpft.</p>
            <p>(4) Rufbereitschaftszeiten begründen keine Vergütungspflicht nach § 5 dieses Vertrags. Vergütungspflichtig ist ausschließlich die Zeit der aktiven Auftragsausführung gemäß § 5 Abs. 3.</p>
            <p>(5) Etwaige vom Arbeitgeber schriftlich angeordnete Bereitschaftsdienste (§ 5 Abs. 3 ArbZG) werden gesondert vergütet.</p>
            <p>(6) Möchte der Arbeitnehmer außerhalb der in § 3 geregelten regelmäßigen Arbeitszeit zusätzlich Fahrdienste in der Rufbereitschaft erbringen, ist sicherzustellen, dass die gesetzlichen Ruhezeiten (mindestens 11 Stunden gemäß § 5 Abs. 1 ArbZG) eingehalten werden.</p>
            <p>(7) Wählt der Arbeitnehmer Rufbereitschaftszeiten eigenständig, ist er selbst dafür verantwortlich, die gesetzlichen Ruhezeiten (§ 5 ArbZG) und Höchstarbeitszeiten (§ 3 ArbZG) einzuhalten.</p>
          </section>

          {/* § 5 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 5 Vergütung</h4>
            <p>
              (1) Vergütungsform. Die Vergütung richtet sich nach dem im jeweiligen Abrechnungszeitraum generierten Nettofahrtentgelt (ohne 19% USt). Der Arbeitnehmer erhält 40% des so ermittelten Nettofahrtentgelts als Bruttovergütung. Ein gesonderter Grundlohn oder feste Vergütungsbestandteile werden nicht geschuldet, sofern nicht die Mindestlohngarantie nach Abs. 2 eingreift.
            </p>
            <p>
              (2) Mindestlohngarantie. Die Bruttovergütung nach Abs. 1 darf in keinem Abrechnungszeitraum den Betrag unterschreiten, der sich aus der Multiplikation der vergütungspflichtig geleisteten Arbeitsstunden mit dem gesetzlichen Mindestlohn ergibt.
            </p>
            <p>(3) Vergütungspflichtige Arbeitszeit. Vergütungspflichtig ist ausschließlich die Zeit der aktiven Auftragsausführung. Rufbereitschaftszeiten sind nicht vergütungspflichtig.</p>
            <p>(4) Kontrollabrechnung. Der Arbeitgeber erstellt monatlich eine Kontrollabrechnung.</p>
            <p>(5) Nachtarbeitszuschlag. Für Arbeitsstunden zwischen 23:00 und 06:00 Uhr erhält der Arbeitnehmer einen Zeitzuschlag von 10%.</p>
            <p>(6) Fälligkeit. Die Vergütung ist monatlich nachträglich fällig, spätestens am letzten Werktag des Folgemonats.</p>
          </section>

          {/* § 6 a § 13 */}
          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 6 Barabrechnung</h4>
            <p>Vom Arbeitnehmer vereinnahmte Barzahlungen sind spätestens am wöchentlichen Übergabetermin an den Arbeitgeber abzuführen und im Protokoll zu dokumentieren.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 7 Urlaub</h4>
            <p>Der Arbeitnehmer hat Anspruch auf 20 Arbeitstage bezahlten Erholungsurlaub pro Jahr (bei einer 5-Tage-Woche). Das Urlaubsentgelt richtet sich nach dem Durchschnittsverdienst der letzten 13 Wochen.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-sm">§ 8 bis § 13 Schlussbestimmungen</h4>
            <p>Es gelten die üblichen Bestimmungen zu Verhaltenspflichten, Nebentätigkeiten, Verschwiegenheit, Ausschlussfristen (3 Monate), Adressänderungen und Salvatorischer Klausel.</p>
          </section>

          {/* Firma */}
          <div className="mt-12 pt-6 border-t border-gray-400 font-sans text-xs space-y-6">
            <p>Edingen-Neckarhausen, den <strong>{signatureDate}</strong></p>
            
            <div className="grid grid-cols-2 gap-12 text-center pt-4">
              <div>
                <div className="border-b border-black mb-2 h-12"></div>
                <p className="font-bold">Luis Jorge Gama Maldonado</p>
                <p className="text-[10px] text-gray-500">(Arbeitgeber)</p>
              </div>

              <div>
                <div className="border-b border-black mb-2 h-12"></div>
                <p className="font-bold">{employee.lastName}, {employee.firstName}</p>
                <p className="text-[10px] text-gray-500">(Arbeitnehmer)</p>
              </div>
            </div>
          </div>

          {/* Anlage 1 */}
          <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-400 space-y-4 text-xs font-sans">
            <h3 className="font-bold uppercase text-center">Anlage 1 zum Arbeitsvertrag vom {startDate}</h3>
            <p className="font-bold">Bestätigung Betriebsanweisung / Erläuterung Vergütung</p>
            <p><strong>A.</strong> Der Arbeitnehmer bestätigt, die Betriebsanweisung für Fahrer erhalten, gelesen und verstanden zu haben.</p>
            <p><strong>B.</strong> Beispiel Vergütungsberechnung: 119,00 € Brutto inkl. USt = 100,00 € Nettofahrtentgelt → 40% Arbeitnehmer = 40,00 € Bruttovergütung.</p>
            <p><strong>C.</strong> Der Arbeitnehmer bestätigt, dass während Rufbereitschaftszeiten keine Einsatzpflicht besteht.</p>
            
            <div className="grid grid-cols-2 gap-12 text-center pt-8">
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="font-bold">Arbeitgeber</p>
              </div>
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="font-bold">Arbeitnehmer ({employee.lastName})</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}