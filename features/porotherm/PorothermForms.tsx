
import React, { useState } from 'react';
import type { PorothermProduct, PorothermAgreement } from '../../types';
import { FormGroup, Input, Select } from '../../components/ui/FormControls';

// Agreement Form
interface PorothermAgreementFormProps {
    agreement: Partial<PorothermAgreement> | null;
    onSave: (agreement: Partial<PorothermAgreement>) => void;
    onCancel: () => void;
}

export const PorothermAgreementForm: React.FC<PorothermAgreementFormProps> = ({ agreement, onSave, onCancel }) => {
    const [formData, setFormData] = useState(agreement || { name: '', code: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'name' && value.trim()) setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim()) {
            setError('Nazwa porozumienia jest wymagana.');
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormGroup label="Nazwa Porozumienia" error={error}>
                <Input name="name" value={formData.name || ''} onChange={handleChange} error={!!error} />
            </FormGroup>
            <FormGroup label="Kod Porozumienia (opcjonalnie)">
                <Input name="code" value={formData.code || ''} onChange={handleChange} />
            </FormGroup>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz</button>
            </div>
        </form>
    );
};


// Product Form
interface PorothermProductFormProps {
    product: PorothermProduct | null;
    onSave: (product: PorothermProduct) => void;
    onCancel: () => void;
}

export const PorothermProductForm: React.FC<PorothermProductFormProps> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<PorothermProduct>>(product || {
        name: '', location: 'Lębork', netPrice: null, additionalDiscount: null, unitsPerPallet: null, palletsPerTruck: null, category: '', specifications: ''
    });
    const [errors, setErrors] = useState<{ additionalDiscount?: string }>({});

    const validate = (data: Partial<PorothermProduct>) => {
        const newErrors: { additionalDiscount?: string } = {};
        const discount = data.additionalDiscount;
        if (discount !== null && (discount < 0 || discount > 1)) {
            newErrors.additionalDiscount = 'Rabat musi być w zakresie 0-100%.';
        }
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isPercentage = false) => {
        const { name, value } = e.target;
        
        let finalValue: string | number | null = value;
        if (e.target.type === 'number') {
            finalValue = value === '' ? null : parseFloat(value);
            if (isPercentage && finalValue !== null) {
                 if (finalValue < 0 || finalValue > 100) {
                    setErrors({ additionalDiscount: 'Rabat musi być w zakresie 0-100%.' });
                } else {
                    setErrors({});
                }
                finalValue /= 100;
            }
        }
        
        const newFormData = { ...formData, [name]: finalValue };
        setFormData(newFormData);
        if(!isPercentage) setErrors(validate(newFormData));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(formData as PorothermProduct);
    };

    const isFormValid = Object.keys(errors).every(key => !errors[key as keyof typeof errors]);
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormGroup label="Nazwa produktu"><Input name="name" value={formData.name} onChange={handleChange} required /></FormGroup>
                <FormGroup label="Lokalizacja"><Select name="location" value={formData.location} onChange={handleChange}><option>Lębork</option><option>Gnaszyn</option></Select></FormGroup>
                <FormGroup label="Cena netto"><Input name="netPrice" type="number" step="0.01" value={formData.netPrice ?? ''} onChange={(e) => handleChange(e)} required /></FormGroup>
                <FormGroup label="Rabat dodatkowy (%)" error={errors.additionalDiscount}>
                    <Input name="additionalDiscount" type="number" step="1" min="0" max="100"
                           value={formData.additionalDiscount === null ? '' : formData.additionalDiscount * 100} 
                           onChange={(e) => handleChange(e, true)}
                           error={!!errors.additionalDiscount}
                           required />
                </FormGroup>
                <FormGroup label="Sztuk na palecie"><Input name="unitsPerPallet" type="number" value={formData.unitsPerPallet ?? ''} onChange={(e) => handleChange(e)} required /></FormGroup>
                <FormGroup label="Palet na auto"><Input name="palletsPerTruck" type="number" value={formData.palletsPerTruck ?? ''} onChange={(e) => handleChange(e)} required /></FormGroup>
                <FormGroup label="Kategoria"><Input name="category" value={formData.category ?? ''} onChange={handleChange} /></FormGroup>
                <FormGroup label="Specyfikacja"><Input name="specifications" value={formData.specifications ?? ''} onChange={handleChange} /></FormGroup>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">Zapisz</button>
            </div>
        </form>
    );
};