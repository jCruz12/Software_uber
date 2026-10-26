'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import StatsCards from '@/components/StatsCards';
import EmployeeDirectory from '@/components/EmployeeDirectory';
import EarningsGlobalView from '@/components/EarningsGlobalView';
import EarningsModal from '@/components/EarningsModal';
import EmployeeViewModal from '@/components/EmployeeViewModal';
import EmployeeFormModal from '@/components/EmployeeFormModal';
import { Users, Calculator, Plus, ChevronRight } from 'lucide-react';
import ContractGeneratorModal from '@/components/ContractGeneratorModal';

const EMPLOYERS = [
  { id: '1', name: 'Luis Jorge Gama Maldonado', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '2', name: 'YottaHWattH RNK', address: 'Jahnstr. 20, 68535 – Edingen Neckarhausen' },
  { id: '3', name: 'YottaHWattH HD2', address: 'Wangerowstraße 14, 69115 Heidelberg' },
];

const API_URL = 'https://software-uber.onrender.com';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@uber.com');
  const [loginPassword, setLoginPassword] = useState('uber1234');

  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState(EMPLOYERS[0]);
  const [currentYear, setCurrentYear] = useState('2026');

  const [mainTab, setMainTab] = useState<'directory' | 'earnings_global'>('directory');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [contractFilter, setContractFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<any>(null);
  const [earningsModalEmp, setEarningsModalEmp] = useState<any>(null);
  
  const [earningsDataMap, setEarningsDataMap] = useState<Record<string, any>>({});

  const [contractModalEmp, setContractModalEmp] = useState<any>(null);

  const [newWeek, setNewWeek] = useState({
    kw: 'KW 39',
    dateRange: '22.09 - 28.09',
    fahrtpreis: '',
    aktion: '',
    serviceFee: '',
    tip: ''
  });

  const [newFine, setNewFine] = useState({
    description: '',
    aktenzeichen: '',
    pin: '',
    amount: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    status: 'Activo',
    contractType: 'Minijob',
    startDate: '',
    birthDate: '',
    krankenkasse: '',
    marginalEmp: '',
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
        data.forEach((emp: any) => fetchEmployeeEarnings(emp.id));
      }
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  const fetchEmployeeEarnings = async (empId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/employees/${empId}/earnings`);
      const data = await res.json();
      
      setEarningsDataMap(prev => ({
        ...prev,
        [empId]: {
          contractType: data.config?.contractType || 'Teilzeit',
          contractHours: data.config?.contractHours || 30,
          hourlyRate: data.config?.hourlyRate || 13.90,
          commissionRate: data.config?.commissionRate || 40,
          vacationProvision: data.config?.vacationProvision || 0,
          cashPaidInHand: data.config?.cashPaidInHand || 0,
          weeks: data.weeks || [],
          fines: data.fines || []
        }
      }));
    } catch (error) {
      console.error('Error al cargar ganancias reales de BD:', error);
    }
  };

  useEffect(() => {
    setCurrentYear(String(new Date().getFullYear()));
    fetchEmployees();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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

  const stats = useMemo(() => {
    const total = employees.length;
    const activos = employees.filter(e => e.status === 'Activo').length;
    const inactivos = employees.filter(e => e.status === 'Inactivo').length;
    const minijob = employees.filter(e => e.contractType === 'Minijob').length;
    const medioTiempo = employees.filter(e => e.contractType === '1/2 Tiempo' || e.contractType === 'Teilzeit').length;

    return { total, activos, inactivos, minijob, medioTiempo };
  }, [employees]);

  const getEmployeeEarningsData = (empId: string) => {
    return earningsDataMap[empId] || {
      contractType: 'Teilzeit',
      contractHours: 30,
      hourlyRate: 13.90,
      commissionRate: 40,
      vacationProvision: 0,
      weeks: [],
      fines: [],
      cashPaidInHand: 0,
    };
  };

  const updateEmployeeEarningsConfig = async (empId: string, updatedFields: any) => {
    const currentData = getEmployeeEarningsData(empId);
    const merged = { ...currentData, ...updatedFields };

    setEarningsDataMap(prev => ({ ...prev, [empId]: merged }));

    try {
      await fetch(`${API_URL}/api/employees/${empId}/earnings/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: merged.contractType,
          contractHours: Number(merged.contractHours),
          hourlyRate: Number(merged.hourlyRate),
          commissionRate: Number(merged.commissionRate),
          vacationProvision: Number(merged.vacationProvision),
          cashPaidInHand: Number(merged.cashPaidInHand)
        })
      });
    } catch (error) {
      console.error('Error al sincronizar configuración con la BD:', error);
    }
  };

  const computeEarningsSummary = (empId: string) => {
    const data = getEmployeeEarningsData(empId);
    
    const calculatedWeeks = data.weeks.map((w: any) => {
      const fahrtpreis = Number(w.fahrtpreis) || 0;
      const aktion = Number(w.aktion) || 0;
      const serviceFee = Number(w.serviceFee) || 0;
      const tip = Number(w.tip) || 0;

      const tripNetTotal = fahrtpreis + aktion - serviceFee;
      const driverShare = tripNetTotal * (data.commissionRate / 100);
      const weekTotal = driverShare + tip;

      return { ...w, tripNetTotal, driverShare, weekTotal };
    });

    const totalFahrtpreis = calculatedWeeks.reduce((acc: number, w: any) => acc + (Number(w.fahrtpreis) || 0), 0);
    const totalAktion = calculatedWeeks.reduce((acc: number, w: any) => acc + (Number(w.aktion) || 0), 0);
    const totalServiceFee = calculatedWeeks.reduce((acc: number, w: any) => acc + (Number(w.serviceFee) || 0), 0);
    const totalTips = calculatedWeeks.reduce((acc: number, w: any) => acc + (Number(w.tip) || 0), 0);
    
    const gesamtBruttoTrips = totalFahrtpreis + totalAktion - totalServiceFee;
    const totalDriverCommission = gesamtBruttoTrips * (data.commissionRate / 100);
    const totalGrossDriverEarnings = totalDriverCommission + totalTips;

    const totalFines = (data.fines || []).reduce((acc: number, f: any) => acc + (Number(f.amount) || 0), 0);
    const monthlyContractBasePay = (Number(data.contractHours) || 0) * 4.33 * (Number(data.hourlyRate) || 0);

    const totalDeductions = totalFines + (Number(data.vacationProvision) || 0);
    const totalNetEarnings = Math.max(0, totalGrossDriverEarnings - totalDeductions);

    const cashPaid = Number(data.cashPaidInHand) || 0;
    const bankTransferAmount = Math.max(0, totalNetEarnings - cashPaid);

    return {
      calculatedWeeks,
      totalFahrtpreis,
      totalAktion,
      totalServiceFee,
      totalTips,
      gesamtBruttoTrips,
      totalDriverCommission,
      totalGrossDriverEarnings,
      totalFines,
      monthlyContractBasePay,
      totalDeductions,
      totalNetEarnings,
      cashPaid,
      bankTransferAmount
    };
  };

  const handleAddWeek = async (empId: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/employees/${empId}/weeks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kw: newWeek.kw || 'KW',
          dateRange: newWeek.dateRange || '',
          fahrtpreis: Number(newWeek.fahrtpreis) || 0,
          aktion: Number(newWeek.aktion) || 0,
          serviceFee: Number(newWeek.serviceFee) || 0,
          tip: Number(newWeek.tip) || 0
        })
      });

      if (res.ok) {
        fetchEmployeeEarnings(empId);
        setNewWeek({ kw: 'KW 39', dateRange: '', fahrtpreis: '', aktion: '', serviceFee: '', tip: '' });
      }
    } catch (error) {
      console.error('Error al guardar semana en la BD:', error);
    }
  };

  const handleDeleteWeek = async (empId: string, weekId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/weeks/${weekId}`, { method: 'DELETE' });
      if (res.ok) fetchEmployeeEarnings(empId);
    } catch (error) {
      console.error('Error al eliminar semana de la BD:', error);
    }
  };

  const handleAddFine = async (empId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newFine.description || !newFine.amount) return;

    try {
      const res = await fetch(`${API_URL}/api/employees/${empId}/fines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newFine.description,
          aktenzeichen: newFine.aktenzeichen || '-',
          pin: newFine.pin || '-',
          amount: Number(newFine.amount) || 0
        })
      });

      if (res.ok) {
        fetchEmployeeEarnings(empId);
        setNewFine({ description: '', aktenzeichen: '', pin: '', amount: '' });
      }
    } catch (error) {
      console.error('Error al guardar multa en la BD:', error);
    }
  };

  const handleDeleteFine = async (empId: string, fineId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/fines/${fineId}`, { method: 'DELETE' });
      if (res.ok) fetchEmployeeEarnings(empId);
    } catch (error) {
      console.error('Error al eliminar multa de la BD:', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      marginalEmp: emp.marginalEmp || '',
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

  const toggleEmployeeStatus = async (emp: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = emp.status === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await fetch(`${API_URL}/api/employees/${emp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const confirmDelete = async () => {
    if (deletingEmployeeId) {
      try {
        await fetch(`${API_URL}/api/employees/${deletingEmployeeId}`, { method: 'DELETE' });
        setEmployees(prev => prev.filter(e => e.id !== deletingEmployeeId));
        setDeletingEmployeeId(null);
        if (viewingEmployee?.id === deletingEmployeeId) setViewingEmployee(null);
        if (earningsModalEmp?.id === deletingEmployeeId) setEarningsModalEmp(null);
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', status: 'Activo', contractType: 'Minijob',
      startDate: '', birthDate: '', krankenkasse: '', marginalEmp: '',
      stNummer: '', svNummer: '', address: '', zipCode: '', city: ''
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
      case 'Teilzeit':
        return <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 text-xs font-semibold">1/2 Tiempo (Teilzeit)</span>;
      default:
        return <span className="text-gray-400 text-xs font-normal">{contrato || 'No Aplica'}</span>;
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
          <span className="text-xs tracking-widest uppercase text-gray-400 font-medium">Portal de Empleados & Nóminas</span>
        </header>

        <main className="flex-1 flex items-center justify-center my-12">
          <div className="w-full max-w-md bg-white text-black p-8 sm:p-10 shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm mb-8">Acceso exclusivo para gestión administrativa y cálculo de ganancias.</p>

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
        <footer className="text-center text-xs text-gray-500">© {currentYear} J-C Software Inc. Gestión de Empleados.</footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-black flex flex-col font-sans print:bg-white print:text-black">
      
      <Navbar 
        selectedEmployer={selectedEmployer} 
        setSelectedEmployer={setSelectedEmployer} 
        EMPLOYERS={EMPLOYERS} 
        handleLogout={handleLogout} 
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 print:p-0 print:max-w-none">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 print:hidden">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Base de Datos Conectada - Sistema de Nóminas</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
              {mainTab === 'directory' ? 'Gestión de Personal' : 'Control de Ganancias y Nóminas'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Empleador activo: <strong className="text-black">{selectedEmployer.name}</strong></p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-gray-300 p-1 flex items-center gap-1">
              <button
                onClick={() => setMainTab('directory')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${mainTab === 'directory' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Directorio Empleados</span>
              </button>
              <button
                onClick={() => setMainTab('earnings_global')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${mainTab === 'earnings_global' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cálculo Ganancias (Excel)</span>
              </button>
            </div>

            <button
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="bg-black hover:bg-gray-800 text-white font-semibold px-5 py-2.5 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Empleado</span>
            </button>
          </div>
        </div>

        <StatsCards stats={stats} />

        {mainTab === 'directory' && (
          <EmployeeDirectory
            filteredEmployees={filteredEmployees}
            employees={employees}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            contractFilter={contractFilter}
            setContractFilter={setContractFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            computeEarningsSummary={computeEarningsSummary}
            toggleEmployeeStatus={toggleEmployeeStatus}
            setViewingEmployee={setViewingEmployee}
            setEarningsModalEmp={setEarningsModalEmp}
            openEditModal={openEditModal}
            setDeletingEmployeeId={setDeletingEmployeeId}
            renderStatusBadge={renderStatusBadge}
            renderContractBadge={renderContractBadge}
            setContractModalEmp={setContractModalEmp}
          />
        )}

        {mainTab === 'earnings_global' && (
          <EarningsGlobalView
            employees={employees}
            computeEarningsSummary={computeEarningsSummary}
            getEmployeeEarningsData={getEmployeeEarningsData}
            setEarningsModalEmp={setEarningsModalEmp}
          />
        )}

      </main>

      <EarningsModal
        earningsModalEmp={earningsModalEmp}
        setEarningsModalEmp={setEarningsModalEmp}
        selectedEmployer={selectedEmployer}
        getEmployeeEarningsData={getEmployeeEarningsData}
        computeEarningsSummary={computeEarningsSummary}
        updateEmployeeEarningsConfig={updateEmployeeEarningsConfig}
        handleDeleteWeek={handleDeleteWeek}
        handleAddWeek={handleAddWeek}
        newWeek={newWeek}
        setNewWeek={setNewWeek}
        handleDeleteFine={handleDeleteFine}
        handleAddFine={handleAddFine}
        newFine={newFine}
        setNewFine={setNewFine}
        handlePrintPayroll={() => window.print()}
      />

      <EmployeeViewModal
        viewingEmployee={viewingEmployee}
        setViewingEmployee={setViewingEmployee}
        selectedEmployer={selectedEmployer}
        renderStatusBadge={renderStatusBadge}
        renderContractBadge={renderContractBadge}
        setEarningsModalEmp={setEarningsModalEmp}
        openEditModal={openEditModal}
      />

      <EmployeeFormModal
        isAddModalOpen={isAddModalOpen}
        editingEmployee={editingEmployee}
        setIsAddModalOpen={setIsAddModalOpen}
        setEditingEmployee={setEditingEmployee}
        formData={formData}
        handleFormChange={handleFormChange}
        handleCreateEmployee={handleCreateEmployee}
        handleUpdateEmployee={handleUpdateEmployee}
      />
      <ContractGeneratorModal
        isOpen={!!contractModalEmp}
        onClose={() => setContractModalEmp(null)}
        employee={contractModalEmp}
        selectedEmployer={selectedEmployer}
      />

      {deletingEmployeeId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-sm p-6 border border-gray-300 shadow-2xl">
            <h3 className="text-lg font-extrabold tracking-tight mb-2">¿Eliminar registro?</h3>
            <p className="text-xs text-gray-500 mb-6">Esta acción eliminará permanentemente al empleado y sus datos de la base de datos.</p>
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