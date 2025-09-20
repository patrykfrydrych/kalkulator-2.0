import React, { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { FormGroup, Input } from '../../../../components/ui/FormControls';
import type { VentilationData } from '../types';

interface VentilationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: VentilationData;
    onSave: (data: VentilationData) => void;
}

const VENT_OPTIONS = [
    { key: 'LK1', label: 'LK1 (20x25cm)' },
    { key: 'LK2', label: 'LK2 (36x25cm)' },
    { key: 'LK2-40', label: 'LK2-40 (40x25cm)' },
    { key: 'LK2-P', label: 'LK2-P (46x20cm)' },
    { key: 'LK3', label: 'LK3 (52x25cm)' },
    { key: 'LK3-P', label: 'LK3-P (67x20cm)' },
    { key: 'LK4', label: 'LK4 (68x25cm)' },
    { key: 'LK4-P', label: 'LK4-P (88x20cm)' },
];

export const VentilationModal: React.FC<VentilationModalProps> = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState<VentilationData>(data);

    const handleChange = (key: string, value: string) => {
        const parsedValue = parseFloat(value.replace(',', '.')) || 0;
        setFormData(prev => ({
            ...prev,
            [key]: parsedValue < 0 ? 0 : parsedValue,
        }));
    };
    
    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dodatkowe pustaki wentylacyjne LK">
            <p className="text-sm text-slate-600 mb-4">Proszę podać wysokość kanałów wentylacyjnych w metrach dla poszczególnych pustaków.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {VENT_OPTIONS.map(opt => (
                    <FormGroup key={opt.key} label={opt.label}>
                        <Input 
                            type="text" 
                            name={opt.key}
                            value={formData[opt.key] || ''}
                            onChange={(e) => handleChange(opt.key, e.target.value)}
                            className="text-right"
                            placeholder="0 m"
                        />
                    </FormGroup>
                ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setFormData({})} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Resetuj</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz i zamknij</button>
            </div>
        </Modal>
    );
};
