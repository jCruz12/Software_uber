import React from 'react';
import { LogOut } from 'lucide-react';

export default function Navbar({ selectedEmployer, setSelectedEmployer, EMPLOYERS, handleLogout }: any) {
  return (
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
              onChange={(e) => setSelectedEmployer(EMPLOYERS.find((emp: any) => emp.id === e.target.value) || EMPLOYERS[0])}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {EMPLOYERS.map((emp: any) => (
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
  );
}