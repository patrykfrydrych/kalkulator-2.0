
import React, { useState } from 'react';
import type { PolbrukProduct } from '../../types';
import { FormGroup, Input } from '../../components/ui/FormControls';

interface PolbrukProductFormProps {
    product: PolbrukProduct | null;
    onSave: (product: PolbrukProduct) => void;
    onCancel: () => void;
}

export const PolbrukProductForm: React.FC<PolbrukProductFormProps> = ({ product, onSave, onCancel }) => {
    const initialData: PolbrukProduct = product || {
        symbol: '', nazwa: '', kolor: '', ksztalt: '', cenaNetto: null, iloscNaPalecie: null, jednostka: 'szt', waga: null, maxPalletsPerTruck: null, rabat: null
    };
    const [formData, setFormData] = useState<PolbrukProduct>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <FormGroup label="Kolor"><Input name="kolor" value={formData.kolor} onChange={handleChange} /></FormGroup>
                <FormGroup label="Kształt"><Input name="ksztalt" value={formData.ksztalt} onChange={handleChange} /></FormGroup>
                <FormGroup label="Cena Detaliczna"><Input name="cenaNetto" type="number" step="0.01" value={formData.cenaNetto ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Rabat (%)"><Input name="rabat" type="number" step="0.1" min="0" max="100" value={formData.rabat ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Ilość na palecie"><Input name="iloscNaPalecie" type="number" value={formData.iloscNaPalecie ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Jednostka"><Input name="jednostka" value={formData.jednostka} onChange={handleChange} /></FormGroup>
                <FormGroup label="Waga palety (t)"><Input name="waga" type="number" step="0.01" value={formData.waga ?? ''} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Maks. palet na auto"><Input name="maxPalletsPerTruck" type="number" value={formData.maxPalletsPerTruck ?? ''} onChange={handleChange} /></FormGroup>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz</button>
            </div>
        </form>
    );
};