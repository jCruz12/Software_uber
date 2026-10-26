import React from 'react';
import { X } from 'lucide-react';

export default function EmployeeFormModal({
  isAddModalOpen,
  editingEmployee,
  setIsAddModalOpen,
  setEditingEmployee,
  formData,
  handleFormChange,
  handleCreateEmployee,
  handleUpdateEmployee
}: any) {
  if (!isAddModalOpen && !editingEmployee) return null;

  return (
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
  );
}