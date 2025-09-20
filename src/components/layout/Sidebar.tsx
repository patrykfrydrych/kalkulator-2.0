import React from 'react';
import type { Manufacturer } from '../../types';

interface SidebarProps {
    manufacturers: Manufacturer[];
    currentManufacturerId: string;
    onSelectManufacturer: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ manufacturers, currentManufacturerId, onSelectManufacturer }) => (
    <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6 overflow-y-auto">
        <div className="mb-8">
            <h1 className="text-xl font-semibold text-slate-900">Kalkulator Sprzedażowy</h1>
            <p className="text-sm text-slate-500">Materiały budowlane</p>
        </div>
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {manufacturers.map((manufacturer) => (
                <div 
                    key={manufacturer.id} 
                    onClick={() => onSelectManufacturer(manufacturer.id)} 
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 min-w-[220px] lg:min-w-full ${currentManufacturerId === manufacturer.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50'}`}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className="text-4xl bg-slate-100 p-2 rounded-md">{manufacturer.icon}</div>
                        <div>
                            <h3 className="font-medium text-slate-800">{manufacturer.name}</h3>
                            <p className="text-xs text-slate-500">{manufacturer.type}</p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between items-center">
                        <span>Produkty: <strong>{manufacturer.productCount}</strong></span>
                        <span className={`font-medium ${manufacturer.status === 'active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {manufacturer.status === 'active' ? 'Aktywny' : 'W przygotowaniu'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </aside>
);
