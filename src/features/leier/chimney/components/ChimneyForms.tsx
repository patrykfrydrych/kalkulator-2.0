import React from 'react';
import { FormGroup, Input, Select } from '../../../../components/ui/FormControls';
import { FI_OPTIONS, FI2_OPTIONS, STAL_PUSTAK_OPTIONS } from '../chimneyData';
import type { ChimneySystemType } from '../types';

interface ChimneyFormProps {
    system: ChimneySystemType;
    options: any;
    onChange: (key: string, value: any) => void;
}

const RadioGroup: React.FC<{ label: string; name: string; value: string; options: { value: string; label: string }[]; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, options, onChange }) => (
    <div>
        <h3 className="text-sm font-medium text-slate-600 mb-1">{label}</h3>
        {options.map(opt => (
            <div key={opt.value}>
                <label className="text-sm text-slate-700 inline-flex items-center">
                    <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} className="mr-2 accent-blue-600" />
                    {opt.label}
                </label>
            </div>
        ))}
    </div>
);


export const ChimneyForms: React.FC<ChimneyFormProps> = ({ system, options, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(e.target.name, e.target.value);
    };

    const commonFields = (
        <FormGroup label="Wysokość komina (m)">
            <Input type="text" name="h" value={options.h} onChange={handleChange} />
        </FormGroup>
    );

    switch (system) {
        case 'izolowany':
        case 'basic':
            return (
                <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                    <RadioGroup label="Pustak obudowy komina" name="pustak" value={options.pustak} onChange={handleChange} options={[
                        { value: 'bez', label: 'Bez kanału wentylacyjnego' },
                        { value: 'went', label: 'Z kanałem wentylacyjnym' },
                    ]} />
                    <RadioGroup label="Wykończenie komina" name="wykonczenie" value={options.wykonczenie} onChange={handleChange} options={[
                        { value: 'tynk', label: 'Pod tynk' },
                        { value: 'obmurowka', label: 'Pod obmurówkę' },
                    ]} />
                     <RadioGroup label="Zakończenie komina" name="zakonczenie" value={options.zakonczenie} onChange={handleChange} options={[
                        { value: 'szalunek', label: 'Szalunek' },
                        { value: 'czapa', label: 'Czapa kominowa' },
                    ]} />
                    <RadioGroup label="Rura podłączenia pieca" name="rurapp" value={options.rurapp} onChange={handleChange} options={[
                        { value: '90', label: '90 stopni' },
                        { value: '45', label: '45 stopni' },
                    ]} />
                </div>
            );

        case 'smart':
        case 'smartplus':
             return (
                <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                     <RadioGroup label="Pustak obudowy komina" name="pustak" value={options.pustak} onChange={handleChange} options={[
                        { value: 'bez', label: 'Bez kanału wentylacyjnego' },
                        { value: 'went', label: 'Z kanałem wentylacyjnym' },
                        { value: 'podwojny', label: 'Z podwójnym kanałem went.' },
                    ]} />
                     <FormGroup label="Wysokość pustaka">
                        <Select name="pustakh" value={options.pustakh} onChange={handleChange}>
                            <option value="33">33 cm</option>
                            <option value="25">24,5 cm</option>
                        </Select>
                    </FormGroup>
                     <RadioGroup label="Wykończenie komina" name="wykonczenie" value={options.wykonczenie} onChange={handleChange} options={[
                        { value: 'tynk', label: 'Pod tynk' },
                        { value: 'obmurowka', label: 'Pod obmurówkę' },
                    ]} />
                    <RadioGroup label="Zakończenie komina" name="zakonczenie" value={options.zakonczenie} onChange={handleChange} options={[
                        { value: 'szalunek', label: 'Szalunek' },
                        { value: 'czapa', label: 'Czapa kominowa' },
                    ]} />
                    <RadioGroup label="Rura podłączenia pieca" name="rurapp" value={options.rurapp} onChange={handleChange} options={[
                        { value: '90', label: '90 stopni' },
                        { value: '45', label: '45 stopni' },
                    ]} />
                </div>
            );
        
        case 'turbo':
        case 'multi':
            return (
                 <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                     <FormGroup label="Ilość podłączeń">
                        <Select name="piece" value={options.piece} onChange={handleChange}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                    </FormGroup>
                    <RadioGroup label="Pustak obudowy komina" name="pustak" value={options.pustak} onChange={handleChange} options={[
                        { value: 'bez', label: 'Bez kanału wentylacyjnego' },
                        { value: 'went', label: 'Z kanałem wentylacyjnym' },
                    ]} />
                    <RadioGroup label="Wykończenie komina" name="wykonczenie" value={options.wykonczenie} onChange={handleChange} options={[
                        { value: 'tynk', label: 'Pod tynk' },
                        { value: 'obmurowka', label: 'Pod obmurówkę' },
                    ]} />
                     <RadioGroup label="Zakończenie komina" name="zakonczenie" value={options.zakonczenie} onChange={handleChange} options={[
                        { value: 'szalunek', label: 'Szalunek' },
                        { value: 'czapa', label: 'Czapa kominowa' },
                    ]} />
                </div>
            )

        case 'turbos':
             return (
                 <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                    <RadioGroup label="Pustak obudowy komina" name="pustak" value={options.pustak} onChange={handleChange} options={[
                        { value: 'bez', label: 'Bez kanału wentylacyjnego' },
                        { value: 'went', label: 'Z kanałem wentylacyjnym' },
                    ]} />
                    <RadioGroup label="Wykończenie komina" name="wykonczenie" value={options.wykonczenie} onChange={handleChange} options={[
                        { value: 'tynk', label: 'Pod tynk' },
                        { value: 'obmurowka', label: 'Pod obmurówkę' },
                    ]} />
                     <RadioGroup label="Zakończenie komina" name="zakonczenie" value={options.zakonczenie} onChange={handleChange} options={[
                        { value: 'szalunek', label: 'Szalunek' },
                        { value: 'czapa', label: 'Czapa kominowa' },
                    ]} />
                </div>
            )
            
        case 'stal':
             return (
                 <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange} disabled>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                     <FormGroup label="Pustak obudowy komina">
                        <Select name="pustak" value={options.pustak} onChange={handleChange}>
                            {STAL_PUSTAK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </Select>
                    </FormGroup>
                     <RadioGroup label="Redukcja przyłącza spalin" name="redukcja" value={options.redukcja} onChange={handleChange} options={[
                        { value: 'tak', label: 'Tak (ø80/ø60)' },
                        { value: 'nie', label: 'Nie' },
                    ]} />
                </div>
            )

        case 'duostal':
             return (
                 <div className="space-y-4">
                    {commonFields}
                    <FormGroup label="Średnica przewodu ceramicznego (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                     <FormGroup label="Średnica przewodu stalowego (cm)">
                        <Select name="fi2" value={options.fi2} onChange={handleChange} disabled>
                            {FI2_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pustak obudowy komina z podwójnym kanałem wentylacyjnym</p>
                    <FormGroup label="Wysokość pustaka">
                        <Select name="pustakh" value={options.pustakh} onChange={handleChange}>
                            <option value="33">33 cm</option>
                            <option value="25">24,5 cm</option>
                        </Select>
                    </FormGroup>
                    <RadioGroup label="Rura podłączenia pieca (przewód ceramiczny)" name="rurapp" value={options.rurapp} onChange={handleChange} options={[
                        { value: '90', label: '90 stopni' },
                        { value: '45', label: '45 stopni' },
                    ]} />
                    <RadioGroup label="Redukcja przyłącza spalin (przewód stalowy)" name="redukcja" value={options.redukcja} onChange={handleChange} options={[
                        { value: 'tak', label: 'Tak (ø80/ø60)' },
                        { value: 'nie', label: 'Nie' },
                    ]} />
                </div>
            )

        case 'duo':
             return (
                 <div className="space-y-4">
                    {commonFields}
                     <FormGroup label="Średnica przewodu ceramicznego (cm)">
                        <Select name="fi" value={options.fi} onChange={handleChange}>
                            {FI_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                     <FormGroup label="Średnica przewodu izostatycznego (cm)">
                        <Select name="fi2" value={options.fi2} onChange={handleChange}>
                            {FI2_OPTIONS[system].map(fi => <option key={fi} value={fi}>{fi}</option>)}
                        </Select>
                    </FormGroup>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pustak obudowy komina: DUO</p>
                    <RadioGroup label="Rura podłączenia pieca (przewód ceramiczny)" name="rurapp" value={options.rurapp} onChange={handleChange} options={[
                        { value: '90', label: '90 stopni' },
                        { value: '45', label: '45 stopni' },
                    ]} />
                </div>
            )

        default:
            return <div>Wybierz system</div>;
    }
};
