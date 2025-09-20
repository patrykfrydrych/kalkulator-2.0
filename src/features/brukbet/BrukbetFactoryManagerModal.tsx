import React, { useState, useEffect } from 'react';
import type { BrukbetFactory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input } from '../../components/ui/FormControls';
import { EditIcon } from '../../components/icons/EditIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { formatCurrency } from '../../services/exportService';

interface BrukbetFactoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    factories: BrukbetFactory[];
    onSave: (factories: BrukbetFactory[]) => void;
}

export const BrukbetFactoryManagerModal: React.FC<BrukbetFactoryManagerModalProps> = ({ isOpen, onClose, factories, onSave }) => {
    const [localFactories, setLocalFactories] = useState(factories);
    const [formState, setFormState] = useState<Partial<BrukbetFactory>>({ id: undefined, nazwa: '', kosztTransportu: null });
    const isEditing = formState.id !== undefined;

    useEffect(() => {
        if (isOpen) {
            setLocalFactories(factories);
        }
    }, [isOpen, factories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'kosztTransportu' ? (value === '' ? null : parseFloat(value)) : value;
        if (name === 'kosztTransportu' && typeof finalValue === 'number' && isNaN(finalValue)) return;
        setFormState(prev => ({...prev, [name]: finalValue }));
    };

    const handleSelectForEdit = (factory: BrukbetFactory) => {
        setFormState({ id: factory.id, nazwa: factory.nazwa, kosztTransportu: factory.kosztTransportu });
    };

    const handleCancelEdit = () => {
        setFormState({ id: undefined, nazwa: '', kosztTransportu: null });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.nazwa?.trim() || formState.kosztTransportu === null || isNaN(formState.kosztTransportu)) {
            alert("Proszę wypełnić wszystkie pola poprawnymi danymi.");
            return;
        }

        if (isEditing) {
            setLocalFactories(prev => prev.map(f => f.id === formState.id ? { ...f, nazwa: formState.nazwa!, kosztTransportu: formState.kosztTransportu! } : f));
        } else {
            setLocalFactories(prev => [...prev, { id: `factory_${Date.now()}`, nazwa: formState.nazwa!, kosztTransportu: formState.kosztTransportu! }]);
        }
        handleCancelEdit();
    };

    const handleDelete = (factoryId: string) => {
        if(localFactories.length <= 1) {
            alert("Nie można usunąć ostatniego zakładu produkcyjnego.");
            return;
        }
        if (window.confirm('Czy na pewno chcesz usunąć ten zakład?')) {
            setLocalFactories(prev => prev.filter(f => f.id !== factoryId));
        }
    };

    const handleSaveAndClose = () => {
        onSave(localFactories);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Zarządzaj Zakładami Produkcyjnymi">
            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-semibold mb-2 text-slate-700">Lista Zakładów</h4>
                    <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                        {localFactories.length > 0 ? localFactories.map(factory => (
                            <div key={factory.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                                <div>
                                    <p className="font-medium text-slate-800">{factory.nazwa}</p>
                                    <p className="text-sm text-slate-500">Koszt transportu: {formatCurrency(factory.kosztTransportu || 0)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleSelectForEdit(factory)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edytuj"><EditIcon /></button>
                                    <button onClick={() => handleDelete(factory.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Usuń"><DeleteIcon /></button>
                                </div>
                            </div>
                        )) : <p className="p-4 text-center text-slate-500">Brak zdefiniowanych zakładów.</p>}
                    </div>
                </div>
                <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mb-2 text-slate-700">{isEditing ? 'Edytuj Zakład' : 'Dodaj Nowy Zakład'}</h4>
                    <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <FormGroup label="Nazwa Zakładu"><Input name="nazwa" value={formState.nazwa || ''} onChange={handleChange} required /></FormGroup>
                                <FormGroup label="Koszt Transportu (zł)"><Input name="kosztTransportu" type="number" step="1" value={formState.kosztTransportu ?? ''} onChange={handleChange} required /></FormGroup>
                            </div>
                            <div className="flex justify-end gap-2">
                                {isEditing && (<button type="button" onClick={handleCancelEdit} className="px-3 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm w-full">Anuluj</button>)}
                                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm w-full">{isEditing ? 'Zapisz' : 'Dodaj'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
             <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="button" onClick={handleSaveAndClose} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Zapisz i Zamknij</button>
            </div>
        </Modal>
    );
};
