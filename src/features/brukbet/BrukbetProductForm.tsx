import React, { useState } from 'react';
import type { BrukbetProduct } from '../../types';
import { FormGroup, Input, Select } from '../../components/ui/FormControls';

interface BrukbetProductFormProps {
    product: BrukbetProduct | null;
    onSave: (product: BrukbetProduct) => void;
    onCancel: () => void;
    groups: string[];
}

export const BrukbetProductForm: React.FC<BrukbetProductFormProps> = ({ product, onSave, onCancel, groups }) => {
    const initialData: BrukbetProduct = product || {
        id: '', symbol: '', grupa: 'STANDARD', nazwa: '', zp: '', waga: null, maxPalletsPerTruck: null, iloscNaPalecie: null, jednostka: 'szt.', cenaNetto: null
    };
    const [formData, setFormData] = useState<BrukbetProduct>(initialData);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | null = value;
        if (type === 'number') {
            finalValue = value === '' ? null : parseFloat(value);
            if (finalValue !== null && isNaN(finalValue)) return;
        }
        setFormData(prev => ({...prev, [name]: finalValue as never }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormGroup label="Symbol"><Input name="symbol" value={formData.symbol} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Nazwa"><Input name="nazwa" value={formData.nazwa} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Grupa"><Select name="grupa" value={formData.grupa} onChange={handleChange}>{groups.map(g => <option key={g} value={g}>{g}</option>)}</Select></FormGroup>
                <FormGroup label="Zakład Produkcyjny (ZP)"><Input name="zp" value={formData.zp} onChange={handleChange} /></FormGroup>
                <FormGroup label="Cena Netto"><Input name="cenaNetto" type="number" step="0.01" value={formData.cenaNetto ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Ilość na palecie"><Input name="iloscNaPalecie" type="number" value={formData.iloscNaPalecie ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Jednostka"><Input name="jednostka" value={formData.jednostka} onChange={handleChange} /></FormGroup>
                <FormGroup label="Waga palety (t)"><Input name="waga" type="number" step="0.01" value={formData.waga ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Maks. palet na auto"><Input name="maxPalletsPerTruck" type="number" value={formData.maxPalletsPerTruck ?? ''} onChange={handleChange} /></FormGroup>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz</button>
            </div>
        </form>
    );
};
