import React, { useState } from 'react';
import type { LeierProduct } from '../../types';
import { FormGroup, Input } from '../../components/ui/FormControls';

interface LeierProductFormProps {
    product: LeierProduct | null;
    onSave: (product: LeierProduct) => void;
    onCancel: () => void;
}

export const LeierProductForm: React.FC<LeierProductFormProps> = ({ product, onSave, onCancel }) => {
    const initialData: Omit<LeierProduct, 'id'> = product || {
        symbol: '',
        nazwa: '',
        rabat: null,
        jednostka: 'szt.',
        iloscNaPalecie: null,
        waga: null,
        cenaNetto: null,
        palletsPerTruck: null
    };
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | null = value;
        if (type === 'number') {
            finalValue = value === '' ? null : parseFloat(value);
            if (finalValue !== null && isNaN(finalValue)) return;
        }
        setFormData(prev => ({ ...prev, [name]: finalValue as never }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: product?.id || '', ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormGroup label="Symbol"><Input name="symbol" value={formData.symbol} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Nazwa"><Input name="nazwa" value={formData.nazwa} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Rabat (%)"><Input name="rabat" type="number" step="1" min="0" max="100" value={formData.rabat ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Cena Netto"><Input name="cenaNetto" type="number" step="0.01" value={formData.cenaNetto ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Ilość na palecie"><Input name="iloscNaPalecie" type="number" value={formData.iloscNaPalecie ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Jednostka"><Input name="jednostka" value={formData.jednostka} onChange={handleChange} /></FormGroup>
                <FormGroup label="Waga palety (t)"><Input name="waga" type="number" step="0.01" value={formData.waga ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Palet na auto"><Input name="palletsPerTruck" type="number" step="1" value={formData.palletsPerTruck ?? ''} onChange={handleChange} /></FormGroup>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz</button>
            </div>
        </form>
    );
};
