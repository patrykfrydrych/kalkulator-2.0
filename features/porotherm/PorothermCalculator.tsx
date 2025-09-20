
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { INITIAL_POROTHERM_DATA } from '../../constants';
import { calculatePorothermProduct } from '../../services/calculationService';
import { exportPorothermToExcel, formatCurrency, formatPercentage } from '../../services/exportService';
import type { PorothermData, PorothermAgreement, PorothermProduct } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input } from '../../components/ui/FormControls';
import { AddIcon } from '../../components/icons/AddIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { PorothermAgreementForm, PorothermProductForm } from './PorothermForms';
import { LoadingOverlay } from '../../components/ui/Spinner';

declare const XLSX: any;

export const PorothermCalculator: React.FC = () => {
    const [data, setData, isLoading] = useSupabaseData<PorothermData>('porotherm', INITIAL_POROTHERM_DATA);
    const [selectedAgreementId, setSelectedAgreementId] = useState(data.selectedAgreementId || data.defaultAgreementId);
    const [errors, setErrors] = useState({ settings: {} as Record<string, string> });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ type: 'agreement' | 'product' | null; data: any | null }>({ type: null, data: null });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setSelectedAgreementId(data.selectedAgreementId || data.defaultAgreementId);
    }, [data.selectedAgreementId, data.defaultAgreementId]);

    useEffect(() => {
        if (selectedAgreementId && !data.agreements.some(a => a.id === selectedAgreementId)) {
            const nextId = data.agreements[0]?.id || '';
            setSelectedAgreementId(nextId);
        }
    }, [data.agreements, selectedAgreementId]);
    
    const openModal = (type: 'agreement' | 'product', data: any = null) => {
        setModalContent({ type, data });
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const selectedAgreement = useMemo(() => data.agreements.find(a => a.id === selectedAgreementId) || data.agreements[0], [data.agreements, selectedAgreementId]);
    const calculatedProducts = useMemo(() => selectedAgreement ? selectedAgreement.products.map(product => calculatePorothermProduct(product, selectedAgreement)) : [], [selectedAgreement]);

    const handleAgreementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedAgreementId(newId);
        setData(prevData => ({ ...prevData, selectedAgreementId: newId }));
    };
    
    const validatePercentage = (value: number | null) => (value !== null && (value < 0 || value > 1)) ? 'Wartość musi być w zakresie 0-100%' : '';

    const handleAgreementDetailsChange = (type: 'settings' | 'transportCosts', key: string, value: string, isPercentage = false) => {
        const parsedValue = value === '' ? null : parseFloat(value);
        if (parsedValue !== null && isNaN(parsedValue)) return;

        let finalValueForState = parsedValue;

        if (isPercentage) {
             if (parsedValue !== null && (parsedValue < 0 || parsedValue > 100)) {
                setErrors(prev => ({ ...prev, settings: { ...prev.settings, [key]: 'Wartość musi być w zakresie 0-100%' } }));
                return; // Or clamp the value, for now we just show error and don't update
            } else {
                 setErrors(prev => ({ ...prev, settings: { ...prev.settings, [key]: '' } }));
            }

            if (parsedValue !== null) {
                finalValueForState = parsedValue / 100;
            }
        }
        
        setData(prev => ({
            ...prev,
            agreements: prev.agreements.map(a => 
                a.id === selectedAgreementId 
                    ? { ...a, [type]: { ...a[type], [key]: finalValueForState } } 
                    : a
            )
        }));
    };

    const handleSaveProduct = (productData: PorothermProduct) => {
        setData(prev => ({
            ...prev,
            agreements: prev.agreements.map(a => 
                a.id === selectedAgreementId 
                    ? { ...a, products: productData.id 
                            ? a.products.map(p => p.id === productData.id ? productData : p) 
                            : [...a.products, { ...productData, id: `prod_${Date.now()}` }] }
                    : a
            )
        }));
        closeModal();
    };
    
    const handleSaveAgreement = (agreementData: Partial<PorothermAgreement>) => {
        if (agreementData.id) {
            setData(prev => ({
                ...prev,
                agreements: prev.agreements.map(a => a.id === agreementData.id ? {...a, ...agreementData} : a)
            }));
        } else {
            const newAgreement: PorothermAgreement = {
                id: `agr_${Date.now()}`,
                name: agreementData.name || 'Nowe Porozumienie',
                code: agreementData.code || '',
                validUntil: new Date().toISOString().split('T')[0],
                transportCosts: { leborkMalbork: 0, gnaszynMalbork: 0 },
                settings: { basicDiscount: 0.22, margin: 0.1, cashDiscount: 0.03 },
                products: [],
                lastUpdate: new Date().toISOString().split('T')[0]
            };
            setData(prev => ({ ...prev, agreements: [...prev.agreements, newAgreement] }));
            setSelectedAgreementId(newAgreement.id);
        }
        closeModal();
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            setData(currentData => ({
                ...currentData,
                agreements: currentData.agreements.map(a => 
                    a.id === selectedAgreementId 
                        ? { ...a, products: a.products.filter(p => p.id !== productId) } 
                        : a
                )
            }));
        }
    };
    
    const handleDeleteAgreement = () => {
        if (data.agreements.length <= 1) {
            alert('Nie można usunąć ostatniego porozumienia.');
            return;
        }
        if (window.confirm(`Czy na pewno chcesz usunąć porozumienie "${selectedAgreement.name}"? Tej operacji nie można cofnąć.`)) {
             setData(prev => {
                const newAgreements = prev.agreements.filter(a => a.id !== selectedAgreementId);
                const newSelectedId = newAgreements[0]?.id || null;
                return { ...prev, agreements: newAgreements, selectedAgreementId: newSelectedId || '' };
            });
        }
    };
    
    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

                if (rows.length < 2) throw new Error("Plik jest pusty lub nie zawiera nagłówków.");

                const headers = rows[0].map(h => String(h || '').trim());
                const lowerCaseHeaders = headers.map(h => h.toLowerCase());

                const requiredHeaders = ['Nazwa produktu', 'Cennik net'];
                const missingRequiredHeaders = requiredHeaders.filter(rh => !lowerCaseHeaders.includes(rh.toLowerCase()));

                if (missingRequiredHeaders.length > 0) {
                    throw new Error(`Brak wymaganych kolumn w pliku: ${missingRequiredHeaders.join(', ')}`);
                }

                const getIndex = (header: string) => lowerCaseHeaders.indexOf(header.toLowerCase());
                                
                const colIndices = {
                    name: getIndex('Nazwa produktu'),
                    location: getIndex('Lokalizacja'),
                    netPrice: getIndex('Cennik net'),
                    additionalDiscount: getIndex('Rabat dod.'),
                    unitsPerPallet: getIndex('szt./paleta'),
                    palletsPerTruck: getIndex('palety/auto'),
                    category: getIndex('Kategoria'),
                    specifications: getIndex('Specyfikacja'),
                };

                const newProducts: PorothermProduct[] = rows.slice(1).map((row, i) => {
                    if (!row || row.every(cell => cell === null || cell === '')) return null;
                    const name = row[colIndices.name];
                    if (!name || String(name).trim() === '') return null;
                    const discountStr = String(row[colIndices.additionalDiscount] || '0').replace('%', '');
                    
                    return {
                        id: `imported_${Date.now()}_${i}`,
                        name: String(name),
                        location: row[colIndices.location] === 'Gnaszyn' ? 'Gnaszyn' : 'Lębork',
                        netPrice: parseFloat(String(row[colIndices.netPrice])) || 0,
                        additionalDiscount: parseFloat(discountStr) / 100 || 0,
                        unitsPerPallet: parseInt(String(row[colIndices.unitsPerPallet])) || 0,
                        palletsPerTruck: parseInt(String(row[colIndices.palletsPerTruck])) || 0,
                        category: String(row[colIndices.category] || ''),
                        specifications: String(row[colIndices.specifications] || ''),
                    };
                }).filter((p): p is PorothermProduct => p !== null);

                if (newProducts.length === 0) throw new Error("Nie znaleziono żadnych prawidłowych produktów do zaimportowania.");
                
                setData(prev => ({
                    ...prev,
                    agreements: prev.agreements.map(a => a.id === selectedAgreementId ? { ...a, products: newProducts } : a)
                }));
                alert(`Import zakończony sukcesem! Zaimportowano ${newProducts.length} produktów.`);
            } catch (error) {
                console.error("Błąd podczas importu pliku:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                 if (e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych Porotherm..."/>
    }

    if (!selectedAgreement) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-blue-600 mb-4">POROTHERM (Wienerberger)</h1>
                <Card><CardContent className="text-center p-8">
                    <p className="mb-4">Brak dostępnych porozumień.</p>
                    <button onClick={() => openModal('agreement')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Dodaj nowe porozumienie</button>
                </CardContent></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">POROTHERM (Wienerberger)</h1>
                    <p className="text-slate-500">Kalkulator pustaków ceramicznych</p>
                </div>
                <div className="flex gap-2">
                     <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                     <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <UploadIcon /> Importuj XLS
                    </button>
                    <button onClick={() => exportPorothermToExcel(calculatedProducts, selectedAgreement)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <DownloadIcon /> Eksportuj XLS
                    </button>
                </div>
            </header>
            <Card>
                <CardHeader><CardTitle>Zarządzanie Porozumieniami</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <select value={selectedAgreementId || ''} onChange={handleAgreementChange} className="w-full p-2 border border-slate-300 rounded-md">
                            {data.agreements.map(agreement => <option key={agreement.id} value={agreement.id}>{agreement.name} - {agreement.code}</option>)}
                        </select>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => openModal('agreement')} className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200" title="Dodaj nowe porozumienie"><AddIcon /></button>
                            <button onClick={() => openModal('agreement', selectedAgreement)} className="p-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200" title="Edytuj nazwę porozumienia"><EditIcon/></button>
                            <button onClick={handleDeleteAgreement} className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200" title="Usuń porozumienie"><DeleteIcon/></button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Ustawienia Cenowe</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormGroup label="Rabat podst. (%)" error={errors.settings?.basicDiscount}>
                            <Input type="number" step="1" min="0" max="100" error={!!errors.settings?.basicDiscount} value={selectedAgreement.settings.basicDiscount === null ? '' : selectedAgreement.settings.basicDiscount * 100} onChange={(e) => handleAgreementDetailsChange('settings', 'basicDiscount', e.target.value, true)} />
                        </FormGroup>
                        <FormGroup label="Marża (%)">
                            <Input type="number" step="1" min="0" max="100" value={selectedAgreement.settings.margin === null ? '' : selectedAgreement.settings.margin * 100} onChange={(e) => handleAgreementDetailsChange('settings', 'margin', e.target.value, true)} />
                        </FormGroup>
                        <FormGroup label="Skonto (%)" error={errors.settings?.cashDiscount}>
                            <Input type="number" step="1" min="0" max="100" error={!!errors.settings?.cashDiscount} value={selectedAgreement.settings.cashDiscount === null ? '' : selectedAgreement.settings.cashDiscount * 100} onChange={(e) => handleAgreementDetailsChange('settings', 'cashDiscount', e.target.value, true)} />
                        </FormGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Koszty Transportu</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormGroup label="Lębork → Malbork (zł)">
                             <Input type="number" step="50" value={selectedAgreement.transportCosts.leborkMalbork ?? ''} onChange={(e) => handleAgreementDetailsChange('transportCosts', 'leborkMalbork', e.target.value)} />
                        </FormGroup>
                        <FormGroup label="Gnaszyn → Malbork (zł)">
                             <Input type="number" step="50" value={selectedAgreement.transportCosts.gnaszynMalbork ?? ''} onChange={(e) => handleAgreementDetailsChange('transportCosts', 'gnaszynMalbork', e.target.value)} />
                        </FormGroup>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Produkty ({calculatedProducts.length})</CardTitle>
                     <button onClick={() => openModal('product')} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        <AddIcon /> Dodaj produkt
                    </button>
                </CardHeader>
                <CardContent><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr>{['Nazwa', 'Lokalizacja', 'Cennik', 'Rabat dod.', 'Zakup', 'Transp.', 'Loco', 'Netto KL', 'Brutto KL', 'szt/pal', 'pal/auto', 'Akcje'].map((h, i) => <th key={h} scope="col" className={`px-4 py-3 ${i === 0 ? 'w-full' : ''}`}>{h}</th>)}</tr></thead>
                    <tbody>{calculatedProducts.map(p => (<tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-900 align-top">{p.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><span className={`px-2 py-1 text-xs font-medium rounded-full ${p.location === 'Lębork' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{p.location}</span></td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatCurrency(p.netPrice || 0)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatPercentage(p.additionalDiscount || 0)}</td>
                        <td className="px-4 py-2 bg-slate-50 font-semibold text-slate-600 whitespace-nowrap align-top">{formatCurrency(p.netPurchasePrice)}</td>
                        <td className="px-4 py-2 bg-slate-50 whitespace-nowrap align-top">{formatCurrency(p.transportPerUnit)}</td>
                        <td className="px-4 py-2 bg-slate-50 font-semibold text-slate-600 whitespace-nowrap align-top">{formatCurrency(p.localPrice)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-700 whitespace-nowrap align-top">{formatCurrency(p.customerNetPrice)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-900 whitespace-nowrap align-top">{formatCurrency(p.customerGrossPrice)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{String(p.unitsPerPallet || '')}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{String(p.palletsPerTruck || '')}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><div className="flex items-center gap-2">
                            <button onClick={() => openModal('product', p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                        </div></td>
                    </tr>))}</tbody>
                </table></div></CardContent>
            </Card>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={
                modalContent.type === 'product' ? (modalContent.data ? 'Edytuj Produkt' : 'Dodaj Produkt') :
                modalContent.type === 'agreement' ? (modalContent.data ? 'Edytuj Porozumienie' : 'Dodaj Porozumienie') :
                'Edytuj Wartość'
            }>
                {modalContent.type === 'product' && <PorothermProductForm product={modalContent.data} onSave={handleSaveProduct} onCancel={closeModal} />}
                {modalContent.type === 'agreement' && <PorothermAgreementForm agreement={modalContent.data} onSave={handleSaveAgreement} onCancel={closeModal} />}
            </Modal>
        </div>
    );
};