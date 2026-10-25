'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  LogOut, 
  ChevronRight, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

const EMPLOYERS = [
  { id: '1', name: 'Luis Jorge Gama Maldonado', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '2', name: 'YottaHWattH RNK', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '3', name: 'YottaHWattH HD2', address: 'Wangerowstraße 14, 69115 Heidelberg' },
];

const API_URL = 'https://software-uber.onrender.com';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@uber.com');
  const [loginPassword, setLoginPassword] = useState('uber1234');

  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState(EMPLOYERS[0]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [contractFilter, setContractFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<any>(null);

  // Formulario Empleado (Todos los campos obligatorios)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    status: 'Activo',
    contractType: 'Minijob',
    startDate: '',
    birthDate: '',
    krankenkasse: '',
    marginalEmp: '-',
    stNummer: '',
    svNummer: '',
    address: '',
    zipCode: '',
    city: ''
  });

  // Cargar empleados desde la Base de Datos (Backend / Render)
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Filtrado de lista global y robusto
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchString = `
        ${emp.firstName || ''} 
        ${emp.lastName || ''} 
        ${emp.city || ''} 
        ${emp.address || ''} 
        ${emp.contractType || ''} 
        ${emp.krankenkasse || ''} 
        ${emp.stNummer || ''} 
        ${emp.svNummer || ''}
      `.toLowerCase();

      const coincideBusqueda = searchString.includes(searchTerm.toLowerCase());
      const coincideEstado = statusFilter === 'Todos' || emp.status === statusFilter;
      const coincideContrato = contractFilter === 'Todos' || emp.contractType === contractFilter;

      return coincideBusqueda && coincideEstado && coincideContrato;
    });
  }, [employees, searchTerm, statusFilter, contractFilter]);

  // Cálculos estadísticos
  const stats = useMemo(() => {
    const total = employees.length;
    const activos = employees.filter(e => e.status === 'Activo').length;
    const inactivos = employees.filter(e => e.status === 'Inactivo').length;
    const minijob = employees.filter(e => e.contractType === 'Minijob').length;
    const medioTiempo = employees.filter(e => e.contractType === '1/2 Tiempo').length;

    return { total, activos, inactivos, minijob, medioTiempo };
  }, [employees]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Crear Empleado en la Base de Datos
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        resetForm();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);
    }
  };

  const openEditModal = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      status: emp.status || 'Activo',
      contractType: emp.contractType || 'Minijob',
      startDate: emp.startDate ? emp.startDate.substring(0, 10) : '',
      birthDate: emp.birthDate ? emp.birthDate.substring(0, 10) : '',
      krankenkasse: emp.krankenkasse || '',
      marginalEmp: emp.marginalEmp || '-',
      stNummer: emp.stNummer || '',
      svNummer: emp.svNummer || '',
      address: emp.address || '',
      zipCode: emp.zipCode || '',
      city: emp.city || ''
    });
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/employees/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingEmployee(null);
        resetForm();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
    }
  };

  // Cambiar estado Activo / Inactivo con clic directo
  const toggleEmployeeStatus = async (emp: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = emp.status === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      const res = await fetch(`${API_URL}/api/employees/${emp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const confirmDelete = async () => {
    if (deletingEmployeeId) {
      try {
        const res = await fetch(`${API_URL}/api/employees/${deletingEmployeeId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setDeletingEmployeeId(null);
          if (viewingEmployee?.id === deletingEmployeeId) {
            setViewingEmployee(null);
          }
          fetchEmployees();
        }
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      status: 'Activo',
      contractType: 'Minijob',
      startDate: '',
      birthDate: '',
      krankenkasse: '',
      marginalEmp: '-',
      stNummer: '',
      svNummer: '',
      address: '',
      zipCode: '',
      city: ''
    });
  };

  const renderStatusBadge = (estado: string) => {
    if (estado === 'Activo') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-xs bg-black text-white cursor-pointer hover:bg-emerald-800 transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Activo 🔄
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-xs bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300 transition-all">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Inactivo 🔄
      </span>
    );
  };

  const renderContractBadge = (contrato: string) => {
    switch(contrato) {
      case 'Minijob':
        return <span className="bg-gray-100 border border-gray-300 text-black px-2 py-0.5 text-xs font-semibold">Minijob</span>;
      case '1/2 Tiempo':
        return <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 text-xs font-semibold">1/2 Tiempo</span>;
      default:
        return <span className="text-gray-400 text-xs font-normal">No Aplica</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-12 font-sans">
        <header className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-white text-black px-2.5 py-0.5 font-extrabold text-xl tracking-tighter">Uber</span>
            <span className="font-light tracking-normal text-gray-300">Staff</span>
          </div>
          <span className="text-xs tracking-widest uppercase text-gray-400 font-medium">Portal de Empleados</span>
        </header>

        <main className="flex-1 flex items-center justify-center my-12">
          <div className="w-full max-w-md bg-white text-black p-8 sm:p-10 shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm mb-8">Acceso exclusivo para el personal administrativo y gestión de personal.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-gray-100 border border-transparent px-4 py-3 text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-gray-100 border border-transparent px-4 py-3 text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
              >
                Ingresar al Sistema <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
        <footer className="text-center text-xs text-gray-500">© {new Date().getFullYear()} Uber Technologies Inc. Gestión de Empleados.</footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-black flex flex-col font-sans">
      
      {/* Barra de Navegación Principal */}
      <nav className="bg-black text-white px-6 py-4 sticky top-0 z-30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="bg-white text-black font-extrabold text-xl px-2 py-0.5 tracking-tighter">Uber</span>
              <span className="font-light text-lg text-gray-300">Staff (Neon DB)</span>
            </div>
            
            {/* Selector de Empleador */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-900 px-3 py-1.5 border border-gray-800 rounded-lg">
              <span className="text-xs text-gray-400">Empleador:</span>
              <select 
                value={selectedEmployer.id}
                onChange={(e) => setSelectedEmployer(EMPLOYERS.find(emp => emp.id === e.target.value) || EMPLOYERS[0])}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {EMPLOYERS.map(emp => (
                  <option key={emp.id} value={emp.id} className="bg-gray-900 text-white">
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-800">
              <div className="w-8 h-8 bg-white text-black font-bold rounded-full flex items-center justify-center text-xs">HR</div>
              <div className="text-left text-xs">
                <p className="font-semibold text-white">Administrador HR</p>
                <p className="text-gray-400 text-[10px]">hr@uber.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Base de Datos Conectada (Neon / Prisma)</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">Gestión de Personal</h1>
            <p className="text-gray-500 text-sm mt-1">Empleador activo: <strong className="text-black">{selectedEmployer.name}</strong></p>
          </div>

          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-5 py-3 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Empleado</span>
          </button>
        </div>

        {/* Tarjetas Informativas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Registros</span>
              <Users className="w-4 h-4 text-black" />
            </div>
            <div className="text-3xl font-extrabold text-black">{stats.total}</div>
          </div>
          <div className="bg-white p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Activos</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">{stats.activos}</div>
          </div>
          <div className="bg-white p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Inactivos</span>
              <UserX className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-extrabold text-gray-500">{stats.inactivos}</div>
          </div>
          <div className="bg-white p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Minijob</span>
              <Briefcase className="w-4 h-4 text-black" />
            </div>
            <div className="text-3xl font-extrabold text-black">{stats.minijob}</div>
          </div>
          <div className="bg-white p-5 border border-gray-200 shadow-sm col-span-2 md:col-span-1">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">1/2 Tiempo</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-black">{stats.medioTiempo}</div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Búsqueda global (nombre, apellido, ciudad, contrato, krankenkasse, st-nummer, sv-nummer)..."
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

        {/* Tabla / Tarjetas de Empleados */}
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
              <table className="w-full text-left text-sm">
                <thead className="bg-black text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Empleado</th>
                    <th className="px-4 py-3.5">Estado (Clic cambiar)</th>
                    <th className="px-4 py-3.5">Contrato</th>
                    <th className="px-4 py-3.5">1er Día</th>
                    <th className="px-4 py-3.5">Krankenkasse</th>
                    <th className="px-4 py-3.5">Nº Fiscal (St-Nr)</th>
                    <th className="px-4 py-3.5">Nº Seg. Social (SV)</th>
                    <th className="px-4 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <button onClick={() => setViewingEmployee(emp)} className="font-bold text-gray-900 hover:underline text-left block">
                          {emp.lastName}, {emp.firstName}
                        </button>
                        <span className="text-[11px] text-gray-400 block truncate max-w-[200px]">
                          {emp.city ? `${emp.city} (${emp.address || ''})` : 'Sin dirección'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => toggleEmployeeStatus(emp, e)}>
                        {renderStatusBadge(emp.status)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {renderContractBadge(emp.contractType)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600">
                        {emp.startDate ? emp.startDate.substring(0, 10) : 'Sin asignar'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-800">
                        {emp.krankenkasse || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600">
                        {emp.stNummer || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600">
                        {emp.svNummer || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewingEmployee(emp)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-all" title="Ver Ficha">
                            <Eye className="w-4 h-4" />
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
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center font-mono">
              <span>Registros mostrados: <strong>{filteredEmployees.length}</strong> / {employees.length}</span>
              <span>BASE DE DATOS NEON / RENDER</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => (
              <div key={emp.id} className="bg-white border border-gray-200 p-6 shadow-sm hover:border-black transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3" onClick={(e) => toggleEmployeeStatus(emp, e)}>
                    <span className="font-mono text-xs text-gray-400">ID: {emp.id.substring(0, 6)}...</span>
                    {renderStatusBadge(emp.status)}
                  </div>
                  <h3 onClick={() => setViewingEmployee(emp)} className="text-lg font-bold text-black hover:underline cursor-pointer mb-1">
                    {emp.lastName}, {emp.firstName}
                  </h3>
                  <div className="mb-4">{renderContractBadge(emp.contractType)}</div>
                  <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">1er Día:</span><span className="font-mono font-semibold">{emp.startDate ? emp.startDate.substring(0, 10) : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">Krankenkasse:</span><span className="font-semibold text-gray-800">{emp.krankenkasse || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">St-Nummer:</span><span className="font-mono text-gray-700">{emp.stNummer || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">SV-Nummer:</span><span className="font-mono text-gray-700">{emp.svNummer || '-'}</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 truncate max-w-[180px]">{emp.city || 'Sin ciudad'}</span>
                  <button onClick={() => setViewingEmployee(emp)} className="px-3 py-1 bg-black text-white text-xs font-semibold">Detalle</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {viewingEmployee && (
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
              <button onClick={() => { const emp = viewingEmployee; setViewingEmployee(null); openEditModal(emp); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider text-black">Editar</button>
              <button onClick={() => setViewingEmployee(null)} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar con CAMPOS OBLIGATORIOS (*) */}
      {(isAddModalOpen || editingEmployee) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-2xl p-6 sm:p-8 border border-gray-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setIsAddModalOpen(false); setEditingEmployee(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>

            <h2 className="text-2xl font-extrabold tracking-tight mb-1">{editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
            <p className="text-xs text-gray-500 mb-6">Todos los campos son obligatorios para guardar en la base de datos.</p>

            <form onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 mb-1">Nombre *</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Apellido *</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Estado *</label>
                <select name="status" required value={formData.status} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Tipo de Contrato *</label>
                <select name="contractType" required value={formData.contractType} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none">
                  <option value="Minijob">Minijob</option>
                  <option value="1/2 Tiempo">1/2 Tiempo</option>
                  <option value="No Aplica">No Aplica</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">1er Día *</label>
                <input type="date" name="startDate" required value={formData.startDate} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Fecha de Nacimiento *</label>
                <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Krankenkasse *</label>
                <input type="text" name="krankenkasse" required value={formData.krankenkasse} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Empleo Marginal *</label>
                <select name="marginalEmp" required value={formData.marginalEmp} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none">
                  <option value="-">-</option>
                  <option value="Knapp B-S">Knapp B-S</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">St-Nummer (Fiscal) *</label>
                <input type="text" name="stNummer" required value={formData.stNummer} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">SV-Nummer (Seg. Social) *</label>
                <input type="text" name="svNummer" required value={formData.svNummer} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none font-mono" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600 mb-1">Dirección (Calle y Número) *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Código Postal (C/P) *</label>
                <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Ciudad *</label>
                <input type="text" name="city" required value={formData.city} onChange={handleFormChange} className="w-full bg-gray-100 p-3 border border-transparent focus:bg-white focus:border-black focus:outline-none" />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingEmployee(null); }} className="px-4 py-2 text-xs font-bold uppercase text-gray-600 hover:bg-gray-100">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  {editingEmployee ? 'Guardar Cambios' : 'Guardar en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deletingEmployeeId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-sm p-6 border border-gray-300 shadow-2xl">
            <h3 className="text-lg font-extrabold tracking-tight mb-2">¿Eliminar registro?</h3>
            <p className="text-xs text-gray-500 mb-6">Esta acción eliminará permanentemente al empleado de la base de datos.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingEmployeeId(null)} className="px-4 py-2 text-xs font-bold uppercase text-gray-600 hover:bg-gray-100">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase">Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}