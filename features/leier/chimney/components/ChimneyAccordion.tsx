import React, { useState } from 'react';
import { CHIMNEY_SYSTEMS } from '../chimneyData';
import { ChimneyForms } from './ChimneyForms';
import type { ChimneyOptions, ChimneySystemType } from '../types';

interface ChimneyAccordionProps {
    options: ChimneyOptions;
    onOptionChange: (system: ChimneySystemType, key: string, value: any) => void;
    onCalculate: (system: ChimneySystemType) => void;
    onClear: () => void;
}

export const ChimneyAccordion: React.FC<ChimneyAccordionProps> = ({ options, onOptionChange, onCalculate, onClear }) => {
    const [openSystem, setOpenSystem] = useState<ChimneySystemType | null>(null);

    const handleToggle = (systemId: ChimneySystemType) => {
        if (openSystem === systemId) {
            setOpenSystem(null);
            onClear();
        } else {
            setOpenSystem(systemId);
            onCalculate(systemId);
        }
    };
    
    const handleFormChange = (system: ChimneySystemType, key: string, value: any) => {
        onOptionChange(system, key, value);
    };

    return (
        <div className="border border-slate-200 rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b border-slate-200">
                 <h3 className="text-lg font-semibold text-slate-800">Wybierz typ komina:</h3>
            </div>
            <div id="chimney-accordion">
                {CHIMNEY_SYSTEMS.map(system => (
                    <div key={system.id} className="border-b last:border-b-0 border-slate-200">
                        <h2
                            onClick={() => handleToggle(system.id)}
                            className={`p-4 font-medium cursor-pointer transition-colors ${openSystem === system.id ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                            {system.name}
                        </h2>
                        {openSystem === system.id && (
                            <div className="p-4 bg-white">
                                <ChimneyForms
                                    system={system.id}
                                    options={options[system.id]}
                                    onChange={(key, value) => handleFormChange(system.id, key, value)}
                                />
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => onCalculate(system.id)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Kalkuluj
                                    </button>
                                     <button onClick={onClear} className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300">
                                        Wyczyść
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
