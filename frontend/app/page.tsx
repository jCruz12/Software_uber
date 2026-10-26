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
  AlertCircle,
  DollarSign,
  Calculator,
  Calendar,
  FileSpreadsheet,
  Printer,
  Receipt,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

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

  // Active view tab in main portal: 'directory' or 'earnings_global'
  const [mainTab, setMainTab] = useState<'directory' | 'earnings_global'>('directory');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [contractFilter, setContractFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('table');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<any>(null);

  // Modal / View specifically for Employee Earnings & Payroll
  const [earningsModalEmp, setEarningsModalEmp] = useState<any>(null);
  
  // Earnings State per Employee (Guardado dinámicamente desde la BD)
  const [earningsDataMap, setEarningsDataMap] = useState<Record<string, any>>({});

  // New Week Input State
  const [newWeek, setNewWeek] = useState({
    kw: 'KW 39',
    dateRange: '22.09 - 28.09',
    fahrtpreis: '',
    aktion: '',
    serviceFee: '',
    tip: ''
  });

  // New Fine Input State
  const [newFine, setNewFine] = useState({
    description: '',
    aktenzeichen: '',
    pin: '',
    amount: ''
  });

  // Employee Form
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

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
        // Cargar ganancias reales de cada empleado desde la BD
        data.forEach((emp: any) => fetchEmployeeEarnings(emp.id));
      }
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  // Cargar datos reales de ganancias, semanas y multas desde la BD
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

  // Earnings helper functions
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

  // Guardar cambios de configuración en la BD
  const updateEmployeeEarningsConfig = async (empId: string, updatedFields: any) => {
    const currentData = getEmployeeEarningsData(empId);
    const merged = { ...currentData, ...updatedFields };

    setEarningsDataMap(prev => ({
      ...prev,
      [empId]: merged
    }));

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

  // Calculations logic matching Excel sheets
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

      return {
        ...w,
        tripNetTotal,
        driverShare,
        weekTotal
      };
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

  // Añadir semana directo a la BD
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
        setNewWeek({
          kw: 'KW 39',
          dateRange: '',
          fahrtpreis: '',
          aktion: '',
          serviceFee: '',
          tip: ''
        });
      }
    } catch (error) {
      console.error('Error al guardar semana en la BD:', error);
    }
  };

  // Eliminar semana de la BD
  const handleDeleteWeek = async (empId: string, weekId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/weeks/${weekId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEmployeeEarnings(empId);
      }
    } catch (error) {
      console.error('Error al eliminar semana de la BD:', error);
    }
  };

  // Añadir multa directo a la BD
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

  // Eliminar multa de la BD
  const handleDeleteFine = async (empId: string, fineId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/fines/${fineId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEmployeeEarnings(empId);
      }
    } catch (error) {
      console.error('Error al eliminar multa de la BD:', error);
    }
  };

  // Employee Form handlers
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
      case 'Teilzeit':
        return <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 text-xs font-semibold">1/2 Tiempo (Teilzeit)</span>;
      default:
        return <span className="text-gray-400 text-xs font-normal">{contrato || 'No Aplica'}</span>;
    }
  };

  const handlePrintPayroll = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-12 font-sans">
        <header className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-white text-black px-2.5 py-0.5 font-extrabold text-xl tracking-tighter">Uber</span>
            <span className="font-light tracking-normal text-gray-300">Staff & Payroll</span>
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
        <footer className="text-center text-xs text-gray-500">© {currentYear} Uber Technologies Inc. Gestión de Empleados.</footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-black flex flex-col font-sans print:bg-white print:text-black">
      
      <nav className="bg-black text-white px-6 py-4 sticky top-0 z-30 border-b border-gray-800 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="bg-white text-black font-extrabold text-xl px-2 py-0.5 tracking-tighter">Uber</span>
              <span className="font-light text-lg text-gray-300">Staff Portal</span>
            </div>
            
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

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 print:p-0 print:max-w-none">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 print:hidden">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Base de Datos Conectada (Neon DB) & Sistema de Nóminas</div>
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 print:hidden">
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

        {mainTab === 'directory' && (
          <>
            <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
                  <table className="w-full text-center text-sm">
                    <thead className="bg-black text-white text-[11px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-5 py-3.5 text-center">Empleado</th>
                        <th className="px-4 py-3.5 text-center">Estado</th>
                        <th className="px-4 py-3.5 text-center">Contrato</th>
                        <th className="px-4 py-3.5 text-center">1er Día</th>
                        <th className="px-4 py-3.5 text-center">Krankenkasse</th>
                        <th className="px-4 py-3.5 text-center">Nº Fiscal (St-Nr)</th>
                        <th className="px-4 py-3.5 text-center">Nº Seg. Social (SV)</th>
                        <th className="px-4 py-3.5 text-center">Ganancias / Nómina</th>
                        <th className="px-4 py-3.5 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredEmployees.map((emp) => {
                        const summary = computeEarningsSummary(emp.id);
                        return (
                          <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3.5 whitespace-nowrap text-center">
                              <button onClick={() => setViewingEmployee(emp)} className="font-bold text-gray-900 hover:underline mx-auto block">
                                {emp.lastName}, {emp.firstName}
                              </button>
                              <span className="text-[11px] text-gray-400 block truncate max-w-[200px] mx-auto">
                                {emp.city ? `${emp.city} (${emp.address || ''})` : 'Sin dirección'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-center" onClick={(e) => toggleEmployeeStatus(emp, e)}>
                              {renderStatusBadge(emp.status)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-center">
                              {renderContractBadge(emp.contractType)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                              {emp.startDate ? emp.startDate.substring(0, 10) : 'Sin asignar'}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-800 text-center">
                              {emp.krankenkasse || '-'}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                              {emp.stNummer || '-'}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-gray-600 text-center">
                              {emp.svNummer || '-'}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-center">
                              <button
                                onClick={() => setEarningsModalEmp(emp)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold transition-all"
                              >
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                <span>€{summary.totalNetEarnings.toFixed(2)}</span>
                                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                              </button>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => setEarningsModalEmp(emp)} className="p-1.5 text-emerald-700 hover:bg-emerald-50 transition-all" title="Gestionar Ganancias Excel">
                                  <Calculator className="w-4 h-4" />
                                </button>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center font-mono">
                  <span>Registros mostrados: <strong>{filteredEmployees.length}</strong> / {employees.length}</span>
                  <span>NEON DB PERSISTENT STORAGE</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp) => {
                  const summary = computeEarningsSummary(emp.id);
                  return (
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

                        <div className="bg-emerald-50/60 border border-emerald-200 p-3 mb-4 rounded-xs">
                          <div className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Ganancias Calculadas Mes</div>
                          <div className="text-xl font-extrabold font-mono text-emerald-900">€{summary.totalNetEarnings.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-700 flex justify-between mt-1 pt-1 border-t border-emerald-200/60">
                            <span>A Nómina: €{summary.bankTransferAmount.toFixed(2)}</span>
                            <span>En Mano: €{summary.cashPaid.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">1er Día:</span><span className="font-mono font-semibold">{emp.startDate ? emp.startDate.substring(0, 10) : '-'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">Krankenkasse:</span><span className="font-semibold text-gray-800">{emp.krankenkasse || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">St-Nummer:</span><span className="font-mono text-gray-700">{emp.stNummer || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400 font-medium">SV-Nummer:</span><span className="font-mono text-gray-700">{emp.svNummer || '-'}</span></div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <button onClick={() => setEarningsModalEmp(emp)} className="flex-1 px-3 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Calcular Excel</span>
                        </button>
                        <button onClick={() => setViewingEmployee(emp)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase">Ficha</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {mainTab === 'earnings_global' && (
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
                {employees.map(emp => {
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
        )}

      </main>

      {earningsModalEmp && (() => {
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
                      <strong>St-Nr:</strong> {emp.stNummer || '-'} | <strong>SV-Nr:</strong> {emp.svNummer || '-'}
                    </p>
                  </div>

                  <div className="flex flex-col justify-end text-left md:text-right border-t md:border-t-0 border-gray-200 pt-2 md:pt-0">
                    <p className="text-xs font-semibold text-gray-800">
                      Empleador: <span className="font-extrabold text-black">{selectedEmployer.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{selectedEmployer.address}</p>
                    <p className="text-xs font-mono text-emerald-800 font-bold mt-1">
                      Caja Salud (Krankenkasse): {emp.krankenkasse || '-'}
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
                  <span className="text-[11px] text-gray-500 font-mono">Guardado en Neon DB</span>
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
                      onChange={(e) => setNewWeek(prev => ({ ...prev, kw: e.target.value }))}
                      className="p-1.5 bg-white border border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Fechas (22.09 - 28.09)"
                      value={newWeek.dateRange}
                      onChange={(e) => setNewWeek(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="p-1.5 bg-white border border-gray-300"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Fahrtpreis €"
                      value={newWeek.fahrtpreis}
                      onChange={(e) => setNewWeek(prev => ({ ...prev, fahrtpreis: e.target.value }))}
                      className="p-1.5 bg-white border border-gray-300"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Aktion €"
                      value={newWeek.aktion}
                      onChange={(e) => setNewWeek(prev => ({ ...prev, aktion: e.target.value }))}
                      className="p-1.5 bg-white border border-gray-300"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Servicio €"
                      value={newWeek.serviceFee}
                      onChange={(e) => setNewWeek(prev => ({ ...prev, serviceFee: e.target.value }))}
                      className="p-1.5 bg-white border border-gray-300"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Propina €"
                      value={newWeek.tip}
                      onChange={(e) => setNewWeek(prev => ({ ...prev, tip: e.target.value }))}
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
                      onChange={(e) => setNewFine(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-1.5 bg-white border border-gray-300"
                      required
                    />
                    <div className="grid grid-cols-3 gap-2 font-mono">
                      <input
                        type="text"
                        placeholder="Aktenzeichen"
                        value={newFine.aktenzeichen}
                        onChange={(e) => setNewFine(prev => ({ ...prev, aktenzeichen: e.target.value }))}
                        className="p-1.5 bg-white border border-gray-300 text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="PIN"
                        value={newFine.pin}
                        onChange={(e) => setNewFine(prev => ({ ...prev, pin: e.target.value }))}
                        className="p-1.5 bg-white border border-gray-300 text-[11px]"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Monto €"
                        value={newFine.amount}
                        onChange={(e) => setNewFine(prev => ({ ...prev, amount: e.target.value }))}
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
      })()}

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
              <button onClick={() => { setEarningsModalEmp(viewingEmployee); setViewingEmployee(null); }} className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculadora Excel</span>
              </button>
              <button onClick={() => { const emp = viewingEmployee; setViewingEmployee(null); openEditModal(emp); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider text-black">Editar</button>
              <button onClick={() => setViewingEmployee(null)} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider">Cerrar</button>
            </div>
          </div>
        </div>
      )}

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
                  <option value="1/2 Tiempo">1/2 Tiempo (Teilzeit)</option>
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