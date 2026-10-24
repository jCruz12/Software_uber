'use client';

import React, { useState } from 'react';

// Carga inicial de empleadores
const EMPLOYERS = [
  { id: '1', name: 'Luis Jorge Gama Maldonado', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '2', name: 'YottaHWattH RNK', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '3', name: 'YottaHWattH HD2', address: 'Wangerowstraße 14, 69115 Heidelberg' },
];

// Carga inicial de los 23 empleados
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
    <div className="min-h-screen bg-[#F6F6F6] text-black font-sans">
      <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold tracking-tighter">Uber<span className="font-light text-gray-400">Portal</span></span>
          <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
            Gestión de Personal & Contratos
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400">Empleador Activo:</label>
          <select 
            value={selectedEmployer.id}
            onChange={(e) => setSelectedEmployer(EMPLOYERS.find(emp => emp.id === e.target.value) || EMPLOYERS[0])}
            className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-white"
          >
            {EMPLOYERS.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Total Empleados</p>
            <p className="text-3xl font-extrabold mt-2">{INITIAL_EMPLOYEES.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Activos</p>
            <p className="text-3xl font-extrabold mt-2 text-emerald-600">
              {INITIAL_EMPLOYEES.filter(e => e.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Minijob</p>
            <p className="text-3xl font-extrabold mt-2 text-blue-600">
              {INITIAL_EMPLOYEES.filter(e => e.contractType === 'Minijob').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">1/2 Tiempo (Teilzeit)</p>
            <p className="text-3xl font-extrabold mt-2 text-purple-600">
              {INITIAL_EMPLOYEES.filter(e => e.contractType === '1/2 Tiempo').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
          />

          <div className="flex gap-2">
            {['TODOS', 'Activo', 'Inactivo'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === st ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-12">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Tipo Contrato</th>
                <th className="px-6 py-4">1er Día</th>
                <th className="px-6 py-4">Ciudad / Krankenkasse</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {emp.lastName}, {emp.firstName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{emp.contractType}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.startDate || 'Sin asignar'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {emp.city ? `${emp.city} (${emp.krankenkasse})` : 'Sin registro'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="bg-black text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all"
                    >
                      Gestionar Documentos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEmployee && (
          <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-xl mb-12">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                <p className="text-xs text-gray-500">Empleador asignado: <strong className="text-black">{selectedEmployer.name}</strong></p>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-black font-bold text-sm"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex border-b border-gray-200 mb-6 gap-6 text-sm font-semibold">
              <button 
                onClick={() => setActiveTab('CONTRATO')} 
                className={`pb-3 border-b-2 transition-all ${activeTab === 'CONTRATO' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                📄 Contrato (Arbeitsvertrag)
              </button>
              <button 
                onClick={() => setActiveTab('INSTRUCCIONES')} 
                className={`pb-3 border-b-2 transition-all ${activeTab === 'INSTRUCCIONES' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                📋 Instrucciones Operativas (§ 49 PBefG)
              </button>
              <button 
                onClick={() => setActiveTab('EFECTIVO')} 
                className={`pb-3 border-b-2 transition-all ${activeTab === 'EFECTIVO' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                💶 Entrega de Efectivo
              </button>
              <button 
                onClick={() => setActiveTab('HORAS')} 
                className={`pb-3 border-b-2 transition-all ${activeTab === 'HORAS' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                ⏱️ Registro de Horas
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 leading-relaxed overflow-x-auto">
              {activeTab === 'CONTRATO' && (
                <div>
                  <h3 className="font-bold text-sm mb-2 text-black">ARBEITSVERTRAG — {selectedEmployee.contractType.toUpperCase()}</h3>
                  <p><strong>Arbeitgeber:</strong> {selectedEmployer.name} ({selectedEmployer.address})</p>
                  <p><strong>Arbeitnehmer:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p><strong>Geburtsdatum:</strong> {selectedEmployee.birthDate || 'N/A'}</p>
                  <p><strong>Wohnhaft:</strong> {selectedEmployee.address}, {selectedEmployee.zipCode} {selectedEmployee.city}</p>
                  <p className="mt-4"><strong>§ 1 Beginn:</strong> Ab {selectedEmployee.startDate || 'Datum nach Vereinbarung'}</p>
                  <p><strong>§ 3 Arbeitszeit:</strong> {selectedEmployee.contractType === 'Minijob' ? '4 Stunden/Woche' : '30 Stunden/Woche'}</p>
                </div>
              )}

              {activeTab === 'INSTRUCCIONES' && (
                <div>
                  <h3 className="font-bold text-sm mb-2 text-black">Betriebliche Anweisungen für Fahrer (Mietwagen § 49 PBefG)</h3>
                  <p>Gültig ab: {selectedEmployee.startDate || '1er Día'}</p>
                  <p>Arbeitgeber: {selectedEmployer.name}</p>
                  <p>Fahrer: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <ul className="list-disc pl-5 mt-3 space-y-1">
                    <li>1. Mitführpflichtige Unterlagen (Führerschein, P-Schein, Papiere).</li>
                    <li>2. Annahme und Durchführung von Fahrten (Nur registrierte Aufträge).</li>
                    <li>6. Rückkehrpflicht (§ 49 PBefG).</li>
                    <li>8. Daily Arbeitszeiterfassung & Bargeldabrechnung.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'EFECTIVO' && (
                <div>
                  <h3 className="font-bold text-sm mb-2 text-black">Bargeld-Übergabeprotokoll</h3>
                  <p>Fahrer/in: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p>Eintrittsdatum: {selectedEmployee.startDate || 'N/A'}</p>
                  <p>Monat: Oktober 2026</p>
                  <div className="mt-4 border-t pt-2 grid grid-cols-4 gap-2 text-center font-sans font-semibold">
                    <span>KW</span>
                    <span>Bargeldeinnahmen (€)</span>
                    <span>An Arbeitgeber (€)</span>
                    <span>Unterschrift</span>
                  </div>
                </div>
              )}

              {activeTab === 'HORAS' && (
                <div>
                  <h3 className="font-bold text-sm mb-2 text-black">STUNDENNACHWEIS ({selectedEmployee.contractType})</h3>
                  <p>Mitarbeiter: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p>Regelmäßige Arbeitszeit: {selectedEmployee.contractType === 'Minijob' ? '4 Std/Woche' : '30 Std/Woche'}</p>
                  <p className="mt-2">Erfassung von Arbeitsbeginn, Ende, Pausen und Rufbereitschaft gemäß ArbZG.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}