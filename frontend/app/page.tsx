'use client';

import React, { useState } from 'react';

// Empleadores oficiales extraídos de 'Datos Principales.xlsx'
const EMPLOYERS = [
  { id: '1', name: 'Luis Jorge Gama Maldonado', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '2', name: 'YottaHWattH RNK', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '3', name: 'YottaHWattH HD2', address: 'Wangerowstraße 14, 69115 Heidelberg' },
];

// Lista de empleados con datos reales
const INITIAL_EMPLOYEES = [
  { id: '1', lastName: 'Gogigieni', firstName: 'Prateek', status: 'Inactivo', contractType: 'Minijob', startDate: '', birthDate: '1992-08-12', krankenkasse: 'BKK PwC', stNummer: '69 721 403 562', svNummer: '24-120892-G-029', address: 'LuisenStr. 44', zipCode: '63067', city: 'Offenbach an Main' },
  { id: '2', lastName: 'Rosario Trinidad', firstName: 'Juan Jose', status: 'Activo', contractType: '1/2 Tiempo', startDate: '', birthDate: '1981-07-02', krankenkasse: 'AOK Baden Württemberg', stNummer: '', svNummer: '', address: '', zipCode: '', city: '' },
  { id: '3', lastName: 'Vazquez Acosta', firstName: 'Noelia', status: 'Activo', contractType: 'Minijob', startDate: '2026-06-01', birthDate: '1982-03-23', krankenkasse: 'AOK Baden Württemberg', stNummer: '46 731 727 503', svNummer: '64-230382-V-528', address: 'Markgrafenstraße 2/2', zipCode: '68723', city: 'Schwetzingen' },
  { id: '7', lastName: 'Sanchez Gutierrez', firstName: 'Elias', status: 'Activo', contractType: 'Minijob', startDate: '', birthDate: '1982-10-13', krankenkasse: 'BKK Linde', stNummer: '27 451 607 382', svNummer: '64-131082-S-046', address: 'Deimlerstraße 11', zipCode: '68723', city: 'Oftersheim' },
  { id: '12', lastName: 'Ondhiebawo', firstName: 'Jermaine Ehigie', status: 'Activo', contractType: '1/2 Tiempo', startDate: '2026-08-13', birthDate: '2004-07-25', krankenkasse: 'DAK-Gesundheit', stNummer: '92 583 081 675', svNummer: '24-250704-M-027', address: 'Birkenweg 1/A', zipCode: '69198', city: 'Schriesheim' },
  { id: '13', lastName: 'Bhatti', firstName: 'Faheem Azfar', status: 'Activo', contractType: 'Minijob', startDate: '2026-08-03', birthDate: '1994-09-07', krankenkasse: 'TKK', stNummer: '87 425 032 213', svNummer: '09-070994-B-001', address: 'Pyramidenstraße 15', zipCode: '68169', city: 'Mannheim' },
  { id: '18', lastName: 'Villamizar Rueda', firstName: 'Clinton Andres', status: 'Activo', contractType: 'Minijob', startDate: '2026-08-22', birthDate: '1993-06-19', krankenkasse: 'DAK-Gesundheit', stNummer: '22 127 849 561', svNummer: '12-190693-V-054', address: 'Oberer Rainweg 53', zipCode: '68118', city: 'Heidelberg' },
  { id: '20', lastName: 'Halaidenko', firstName: 'Vladislav', status: 'Activo', contractType: '1/2 Tiempo', startDate: '2026-10-05', birthDate: '1994-06-21', krankenkasse: 'AOK Hessen', stNummer: '0', svNummer: '0', address: 'Rathausstr. 45', zipCode: '68519', city: 'Viermheim' }
];

export default function Dashboard() {
  const [selectedEmployer, setSelectedEmployer] = useState(EMPLOYERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('CONTRATO');

  const filteredEmployees = INITIAL_EMPLOYEES.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.city}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F3F3F3] text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Barra de Navegación Estilo Uber High-Contrast */}
      <nav className="bg-black text-white px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-xl border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black tracking-tighter">Uber<span className="font-light text-zinc-400">Portal</span></span>
          <span className="text-[11px] uppercase tracking-wider bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700 font-semibold">
            Fleet & Contract Management
          </span>
        </div>
        
        {/* Selector de Empleador */}
        <div className="flex items-center gap-3 bg-zinc-900/90 px-4 py-2 rounded-xl border border-zinc-800">
          <label className="text-xs text-zinc-400 font-medium">Empleador:</label>
          <select 
            value={selectedEmployer.id}
            onChange={(e) => setSelectedEmployer(EMPLOYERS.find(emp => emp.id === e.target.value) || EMPLOYERS[0])}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {EMPLOYERS.map(emp => (
              <option key={emp.id} value={emp.id} className="bg-zinc-900 text-white">
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Panel de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Total Empleados</p>
            <p className="text-4xl font-black mt-2 text-zinc-900">{INITIAL_EMPLOYEES.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Activos</p>
            <p className="text-4xl font-black mt-2 text-emerald-600">
              {INITIAL_EMPLOYEES.filter(e => e.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Minijob</p>
            <p className="text-4xl font-black mt-2 text-blue-600">
              {INITIAL_EMPLOYEES.filter(e => e.contractType === 'Minijob').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">1/2 Tiempo (Teilzeit)</p>
            <p className="text-4xl font-black mt-2 text-purple-600">
              {INITIAL_EMPLOYEES.filter(e => e.contractType === '1/2 Tiempo').length}
            </p>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 bg-zinc-100/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
          />

          <div className="flex gap-2 w-full md:w-auto">
            {['TODOS', 'Activo', 'Inactivo'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st ? 'bg-black text-white shadow-md' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla Principal de Empleados */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Empleado</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Tipo Contrato</th>
                  <th className="px-6 py-4">1er Día</th>
                  <th className="px-6 py-4">Ciudad / Krankenkasse</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-zinc-50/80 transition-colors group">
                    <td className="px-6 py-4 font-bold text-zinc-900">
                      {emp.lastName}, {emp.firstName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        emp.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-700">{emp.contractType}</td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">{emp.startDate || 'Sin asignar'}</td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {emp.city ? `${emp.city} (${emp.krankenkasse})` : 'Sin registro'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                      >
                        Gestionar Documentos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visor / Modal de Documentos con Estética Minimalista */}
        {selectedEmployee && (
          <div className="bg-white border border-zinc-300 rounded-3xl p-8 shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                <p className="text-xs text-zinc-500 mt-1">Empleador asignado: <strong className="text-black font-semibold">{selectedEmployer.name}</strong></p>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="bg-zinc-100 hover:bg-black hover:text-white text-zinc-700 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Pestañas de Documentos */}
            <div className="flex flex-wrap border-b border-zinc-200 mb-6 gap-6 text-sm font-bold">
              {[
                { id: 'CONTRATO', label: '📄 Contrato (Arbeitsvertrag)' },
                { id: 'INSTRUCCIONES', label: '📋 Instrucciones (§ 49 PBefG)' },
                { id: 'EFECTIVO', label: '💶 Entrega de Efectivo' },
                { id: 'HORAS', label: '⏱️ Registro de Horas' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`pb-3 border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido del Documento Seleccionado */}
            <div className="bg-zinc-900 text-zinc-100 p-8 rounded-2xl border border-zinc-800 text-xs font-mono leading-relaxed shadow-inner">
              {activeTab === 'CONTRATO' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-800 pb-2">ARBEITSVERTRAG — {selectedEmployee.contractType.toUpperCase()}</h3>
                  <p><strong>Arbeitgeber:</strong> {selectedEmployer.name} ({selectedEmployer.address})</p>
                  <p><strong>Arbeitnehmer:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p><strong>Geburtsdatum:</strong> {selectedEmployee.birthDate || 'N/A'}</p>
                  <p><strong>Wohnhaft:</strong> {selectedEmployee.address}, {selectedEmployee.zipCode} {selectedEmployee.city}</p>
                  <p><strong>Sozialversicherung Nr:</strong> {selectedEmployee.svNummer || 'N/A'}</p>
                  <p><strong>Steuernummer:</strong> {selectedEmployee.stNummer || 'N/A'}</p>
                  <p className="pt-2 text-zinc-300"><strong>§ 1 Beginn:</strong> Ab {selectedEmployee.startDate || 'Datum nach Vereinbarung'}</p>
                  <p className="text-zinc-300"><strong>§ 3 Arbeitszeit:</strong> {selectedEmployee.contractType === 'Minijob' ? '4 Stunden/Woche' : '30 Stunden/Woche'}</p>
                </div>
              )}

              {activeTab === 'INSTRUCCIONES' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-800 pb-2">Betriebliche Anweisungen für Fahrer (Mietwagen § 49 PBefG)</h3>
                  <p>Gültig ab: {selectedEmployee.startDate || 'Pendiente'}</p>
                  <p>Arbeitgeber: {selectedEmployer.name}</p>
                  <p>Fahrer: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-300">
                    <li>1. Mitführpflichtige Unterlagen (Führerschein, P-Schein, Konzessionsauszug).</li>
                    <li>2. Annahme und Durchführung von Fahrten ausschließlich über zugelassene Vermittler (Uber).</li>
                    <li>6. Rückkehrpflicht (§ 49 PBefG) nach Auftragsende zum Betriebssitz.</li>
                    <li>8. Tägliche Arbeitszeiterfassung & Bargeldabrechnungspflicht.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'EFECTIVO' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-800 pb-2">Bargeld-Übergabeprotokoll (Cash Delivery Log)</h3>
                  <p>Fahrer/in: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p>Arbeitgeber: {selectedEmployer.name}</p>
                  <div className="mt-4 border border-zinc-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 bg-zinc-800 p-3 text-center font-bold text-zinc-300">
                      <span>KW (Woche)</span>
                      <span>Einnahmen (€)</span>
                      <span>Abgabe (€)</span>
                      <span>Unterschrift</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-center border-t border-zinc-800 text-zinc-400">
                      <span>KW 40</span>
                      <span>—</span>
                      <span>—</span>
                      <span>[ Pendiente ]</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'HORAS' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-800 pb-2">STUNDENNACHWEIS ({selectedEmployee.contractType})</h3>
                  <p>Mitarbeiter: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p>Regelmäßige Arbeitszeit: {selectedEmployee.contractType === 'Minijob' ? '4 Std/Woche' : '30 Std/Woche'}</p>
                  <p className="text-zinc-400 mt-2">Erfassung von Arbeitsbeginn, Pausen und tatsächlicher Lenkzeit gemäß ArbZG.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}