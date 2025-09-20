import React, { useState } from 'react';
import type { SolbetProduct } from '../../types';
import { FormGroup, Input, Select } from '../../components/ui/FormControls';

interface SolbetProductFormProps {
    product: SolbetProduct | null;
    onSave: (product: SolbetProduct) => void;
    onCancel: () => void;
}

export const SolbetProductForm: React.FC<SolbetProductFormProps> = ({ product, onSave, onCancel }) => {
    const initialData = product || {
        id: '', name: '', density: 600, width: null, height: null, length: null, priceNet: null, category: 'standard', unitsPerPallet: null, palletsPerTruck: null
    };
    const [formData, setFormData] = useState<Omit<SolbetProduct, 'id'> & { id?: string }>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (data: Partial<SolbetProduct>) => {
        const newErrors: Record<string, string> = {};
        if (!data.name?.trim()) newErrors.name = "Nazwa produktu jest wymagana.";
        if (data.priceNet === null || isNaN(data.priceNet) || data.priceNet <= 0) newErrors.priceNet = "Cena musi być liczbą dodatnią.";
        if (data.unitsPerPallet === null || isNaN(data.unitsPerPallet) || data.unitsPerPallet <= 0) newErrors.unitsPerPallet = "Wartość musi być liczbą dodatnią.";
        if (data.palletsPerTruck === null || isNaN(data.palletsPerTruck) || data.palletsPerTruck <= 0) newErrors.palletsPerTruck = "Wartość musi być liczbą dodatnią.";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | null = value;
        if (type === 'number' || name === 'density') {
            finalValue = value === '' ? null : parseFloat(value);
            if (finalValue !== null && isNaN(finalValue)) return;
        }
        const newFormData = { ...formData, [name]: finalValue };
        setFormData(newFormData as any);
         if(Object.keys(errors).length > 0) {
             setErrors(validate(newFormData));
        }
    };
    
    const handleBlur = () => {
        setErrors(validate(formData));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave({ ...formData, id: product?.id || '' } as SolbetProduct);
    };
    
    const isFormValid = Object.keys(validate(formData)).length === 0;

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormGroup label="Nazwa produktu" error={errors.name}><Input name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} error={!!errors.name} /></FormGroup>
                <FormGroup label="Cena netto" error={errors.priceNet}><Input name="priceNet" type="number" step="0.01" value={formData.priceNet ?? ''} onChange={handleChange} onBlur={handleBlur} error={!!errors.priceNet} /></FormGroup>
                <FormGroup label="Gęstość"><Select name="density" value={formData.density} onChange={handleChange}><option value={500}>500</option><option value={600}>600</option></Select></FormGroup>
                <FormGroup label="Kategoria"><Input name="category" value={formData.category} onChange={handleChange} /></FormGroup>
                <FormGroup label="Szerokość (mm)"><Input name="width" type="number" value={formData.width ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Wysokość (mm)"><Input name="height" type="number" value={formData.height ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Długość (mm)"><Input name="length" type="number" value={formData.length ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Sztuk na palecie" error={errors.unitsPerPallet}><Input name="unitsPerPallet" type="number" value={formData.unitsPerPallet ?? ''} onChange={handleChange} onBlur={handleBlur} error={!!errors.unitsPerPallet} /></FormGroup>
                <FormGroup label="Palet na auto" error={errors.palletsPerTruck}><Input name="palletsPerTruck" type="number" value={formData.palletsPerTruck ?? ''} onChange={handleChange} onBlur={handleBlur} error={!!errors.palletsPerTruck} /></FormGroup>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">Zapisz</button>
            </div>
        </form>
    );
};
