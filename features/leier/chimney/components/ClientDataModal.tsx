import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { FormGroup, Input } from '../../../../components/ui/FormControls';
import type { ClientData } from '../types';

interface ClientDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ClientData;
    onSave: (data: ClientData) => void;
}

export const ClientDataModal: React.FC<ClientDataModalProps> = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState<Partial<ClientData>>(data);

    useEffect(() => {
        if (isOpen) {
            setFormData(data);
        }
    }, [data, isOpen]);

    const handleNumericChange = (name: keyof ClientData, value: string) => {
        if (value === '') {
            setFormData(prev => ({ ...prev, [name]: '' }));
            return;
        }
        
        const num = parseFloat(value);
        
        if (!isNaN(num) && num >= 0 && num <= 100) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof ClientData, value: string };
        
        if (name.startsWith('rabat') || name.startsWith('marza')) {
            handleNumericChange(name, value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSave = () => {
        const savedData: ClientData = {
            name: formData.name || '',
            street: formData.street || '',
            city: formData.city || '',
            phone: formData.phone || '',
            description: formData.description || '',
            rabatZakupowyChimney: parseFloat(String(formData.rabatZakupowyChimney)) || 0,
            rabatZakupowyVent: parseFloat(String(formData.rabatZakupowyVent)) || 0,
            marzaChimney: parseFloat(String(formData.marzaChimney)) || 0,
            marzaVent: parseFloat(String(formData.marzaVent)) || 0,
        };
        onSave(savedData);
        onClose();
    };

    const getValue = (field: keyof ClientData) => {
        const value = formData[field];
        return value === undefined || value === null ? '' : String(value);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dane Klienta i Ustawienia">
            <div className="space-y-4">
                <FormGroup label="Nazwisko / Firma"><Input name="name" value={getValue('name')} onChange={handleChange} /></FormGroup>
                <FormGroup label="Adres"><Input name="street" value={getValue('street')} onChange={handleChange} /></FormGroup>
                <FormGroup label="Miejscowość"><Input name="city" value={getValue('city')} onChange={handleChange} /></FormGroup>
                <FormGroup label="Telefon"><Input name="phone" value={getValue('phone')} onChange={handleChange} /></FormGroup>
                <FormGroup label="Dodatkowy opis"><textarea name="description" value={getValue('description')} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-sm shadow-sm" rows={3}></textarea></FormGroup>
                
                <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-semibold text-slate-700 mb-2">Rabaty Zakupowe (od dostawcy)</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <FormGroup label="Rabat na kominy (%)"><Input type="number" name="rabatZakupowyChimney" min="0" max="100" value={getValue('rabatZakupowyChimney')} onChange={handleChange} /></FormGroup>
                        <FormGroup label="Rabat na wentylację (%)"><Input type="number" name="rabatZakupowyVent" min="0" max="100" value={getValue('rabatZakupowyVent')} onChange={handleChange} /></FormGroup>
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                     <h4 className="text-md font-semibold text-slate-700 mb-2">Marża Sprzedażowa (dla klienta)</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <FormGroup label="Marża na kominy (%)"><Input type="number" name="marzaChimney" min="0" max="100" value={getValue('marzaChimney')} onChange={handleChange} /></FormGroup>
                        <FormGroup label="Marża na wentylację (%)"><Input type="number" name="marzaVent" min="0" max="100" value={getValue('marzaVent')} onChange={handleChange} /></FormGroup>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz</button>
            </div>
        </Modal>
    );
};