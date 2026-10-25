'use client';

import React, { useState, useEffect } from 'react';

const EMPLOYERS = [
  { id: '1', name: 'Luis Jorge Gama Maldonado', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '2', name: 'YottaHWattH RNK', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '3', name: 'YottaHWattH HD2', address: 'Wangerowstraße 14, 69115 Heidelberg' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://software-uber.onrender.com';

export default function Dashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState(EMPLOYERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('CONTRATO');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    status: 'Activo',
    contractType: 'Minijob',
    startDate: '',
    birthDate: '',
    krankenkasse: '',
    stNummer: '',
    svNummer: '',
    address: '',
    zipCode: '',
    city: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewEmp({
          firstName: '', lastName: '', status: 'Activo', contractType: 'Minijob',
          startDate: '', birthDate: '', krankenkasse: '', stNummer: '',
          svNummer: '', address: '', zipCode: '', city: ''
        });
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.city || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F3F3F3] text-zinc-900 font-sans selection:bg-black selection:text-white">
      <nav className="bg-black text-white px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-xl border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black tracking-tighter">Uber<span className="font-light text-zinc-400">Portal</span></span>
          <span className="text-[11px] uppercase tracking-wider bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700 font-semibold">
            Fleet & Contract Management (DB Connected)
          </span>
        </div>
        
        <div className="flex items-center gap-4">
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
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-md"
          >
            + Nuevo Empleado
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Total Empleados</p>
            <p className="text-4xl font-black mt-2 text-zinc-900">{employees.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Activos</p>
            <p className="text-4xl font-black mt-2 text-emerald-600">
              {employees.filter(e => e.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Minijob</p>
            <p className="text-4xl font-black mt-2 text-blue-600">
              {employees.filter(e => e.contractType === 'Minijob').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">1/2 Tiempo</p>
            <p className="text-4xl font-black mt-2 text-purple-600">
              {employees.filter(e => e.contractType === '1/2 Tiempo').length}
            </p>
          </div>
        </div>

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
                  <tr key={emp.id} className="hover:bg-zinc-50/80 transition-colors">
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
                    <td className="px-6 py-4 text-zinc-500 font-medium">{emp.startDate ? emp.startDate.substring(0, 10) : 'Sin asignar'}</td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {emp.city ? `${emp.city} (${emp.krankenkasse || 'N/A'})` : 'Sin registro'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-sm"
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

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-zinc-200">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-6">
                <h2 className="text-xl font-black">Nuevo Empleado (Base de Datos)</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-black font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="text-zinc-500 block mb-1">Nombre</label>
                  <input type="text" required value={newEmp.firstName} onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Apellido</label>
                  <input type="text" required value={newEmp.lastName} onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Estado</label>
                  <select value={newEmp.status} onChange={e => setNewEmp({...newEmp, status: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Tipo de Contrato</label>
                  <select value={newEmp.contractType} onChange={e => setNewEmp({...newEmp, contractType: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200">
                    <option value="Minijob">Minijob</option>
                    <option value="1/2 Tiempo">1/2 Tiempo</option>
                    <option value="No Aplica">No Aplica</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">1er Día</label>
                  <input type="date" value={newEmp.startDate} onChange={e => setNewEmp({...newEmp, startDate: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Nacimiento</label>
                  <input type="date" value={newEmp.birthDate} onChange={e => setNewEmp({...newEmp, birthDate: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Krankenkasse</label>
                  <input type="text" value={newEmp.krankenkasse} onChange={e => setNewEmp({...newEmp, krankenkasse: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">St-Nummer</label>
                  <input type="text" value={newEmp.stNummer} onChange={e => setNewEmp({...newEmp, stNummer: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">SV-Nummer</label>
                  <input type="text" value={newEmp.svNummer} onChange={e => setNewEmp({...newEmp, svNummer: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Dirección</label>
                  <input type="text" value={newEmp.address} onChange={e => setNewEmp({...newEmp, address: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Código Postal</label>
                  <input type="text" value={newEmp.zipCode} onChange={e => setNewEmp({...newEmp, zipCode: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Ciudad</label>
                  <input type="text" value={newEmp.city} onChange={e => setNewEmp({...newEmp, city: e.target.value})} className="w-full bg-zinc-100 p-3 rounded-xl border border-zinc-200" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-3 rounded-xl bg-zinc-200 font-bold">Cancelar</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-black text-white font-bold shadow-lg">Guardar en Base de Datos</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}