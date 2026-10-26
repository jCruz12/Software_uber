import React from 'react';
import { Users, UserCheck, UserX, Briefcase, Building2 } from 'lucide-react';

export default function StatsCards({ stats }: any) {
  return (
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
  );
}