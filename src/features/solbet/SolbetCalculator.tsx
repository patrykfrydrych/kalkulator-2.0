import React, { useState, useMemo, useRef } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { INITIAL_SOLBET_DATA } from '../../constants';
import { calculateSolbetProduct } from '../../services/calculationService';
import { exportSolbetToExcel, formatCurrency } from '../../services/exportService';
import type { SolbetData, SolbetProduct } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input } from '../../components/ui/FormControls';
import { AddIcon } from '../../components/icons/AddIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SolbetProductForm } from './SolbetProductForm';
import { LoadingOverlay } from '../../components/ui/Spinner';

declare const XLSX: any;

export const SolbetCalculator: React.FC = () => {
    const [data, setData, isLoading] = useSupabaseData<SolbetData>('solbet', INITIAL_SOLBET_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SolbetProduct | null>(null);

    const openProductModal = (product: SolbetProduct | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };
    
    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && isNaN(finalValue)) return;
        setData(prev => ({ ...prev, settings: { ...prev.settings, [name]: finalValue } }));
    };

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return data.products;
        return data.products.filter(p => p.name.toLowerCase().includes(term));
    }, [data.products, searchTerm]);

    const calculatedProducts = useMemo(() => {
        return filteredProducts.map(p => calculateSolbetProduct(p, data.settings));
    }, [filteredProducts, data.settings]);
    
    const handleSaveProduct = (productData: SolbetProduct) => {
        setData(prev => ({
            ...prev,
            products: productData.id
                ? prev.products.map(p => p.id === productData.id ? productData : p)
                : [...prev.products, { ...productData, id: `solbet_${Date.now()}` }]
        }));
        closeProductModal();
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
             setData(currentData => ({
                ...currentData,
                products: currentData.products.filter(p => p.id !== productId)
            }));
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
                const requiredHeaders = ['nazwa produktu', 'cena netto'];
                const missingRequiredHeaders = requiredHeaders.filter(rh => !lowerCaseHeaders.includes(rh.toLowerCase()));

                if (missingRequiredHeaders.length > 0) {
                    throw new Error(`Brak wymaganych kolumn w pliku: ${missingRequiredHeaders.join(', ')}`);
                }

                const getIndex = (header: string) => lowerCaseHeaders.indexOf(header.toLowerCase());

                const colIndices = {
                    id: getIndex('id'), name: getIndex('nazwa produktu'), density: getIndex('gęstość'),
                    width: getIndex('szerokość'), height: getIndex('wysokość'), length: getIndex('długość'),
                    priceNet: getIndex('cena netto'), category: getIndex('kategoria'),
                    unitsPerPallet: getIndex('sztuk na palecie'), palletsPerTruck: getIndex('palet na auto'),
                };

                const newProducts: SolbetProduct[] = rows.slice(1).map((row, i) => {
                    if (!row || row.every(cell => cell === null || cell === '')) return null;
                    const name = row[colIndices.name];
                    if (!name || String(name).trim() === '') return null;

                    return {
                        id: row[colIndices.id] || `solbet_imported_${Date.now()}_${i}`,
                        name: String(name),
                        density: parseInt(row[colIndices.density]) === 500 ? 500 : 600,
                        width: parseInt(String(row[colIndices.width])) || 0,
                        height: parseInt(String(row[colIndices.height])) || 0,
                        length: parseInt(String(row[colIndices.length])) || 0,
                        priceNet: parseFloat(String(row[colIndices.priceNet])) || 0,
                        category: String(row[colIndices.category] || 'standard'),
                        unitsPerPallet: parseInt(String(row[colIndices.unitsPerPallet])) || 0,
                        palletsPerTruck: parseInt(String(row[colIndices.palletsPerTruck])) || 0,
                    };
                }).filter((p): p is SolbetProduct => p !== null);
                
                if (newProducts.length === 0) throw new Error("Nie znaleziono żadnych prawidłowych produktów do zaimportowania.");

                setData(prev => ({...prev, products: newProducts }));
                alert(`Import zakończony sukcesem! Zaimportowano ${newProducts.length} produktów.`);
            } catch (error) {
                console.error("Błąd podczas importu pliku:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                if(e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych Solbet..."/>
    }
    
    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">SOLBET</h1>
                    <p className="text-slate-500">Kalkulator betonu komórkowego</p>
                </div>
                <div className="flex gap-2">
                     <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                     <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <UploadIcon /> Importuj XLS
                    </button>
                    <button onClick={() => exportSolbetToExcel(data.products)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <DownloadIcon /> Eksportuj XLS
                    </button>
                </div>
            </header>
            <Card>
                <CardHeader><CardTitle>Ustawienia Dynamiczne</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormGroup label="Koszt transportu (zł)"><Input type="number" name="transportCost" value={data.settings.transportCost ?? ''} onChange={handleSettingsChange} step="50"/></FormGroup>
                    <FormGroup label="Rabat (%)"><Input type="number" name="discountPercent" value={data.settings.discountPercent ?? ''} onChange={handleSettingsChange} step="1" min="0" max="100"/></FormGroup>
                    <FormGroup label="Marża (%)"><Input type="number" name="margin" value={data.settings.margin ?? ''} onChange={handleSettingsChange} step="1" min="0" max="100"/></FormGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Produkty ({calculatedProducts.length} / {data.products.length})</CardTitle>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <input type="text" placeholder="Szukaj produktów..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 p-2 border border-slate-300 rounded-md text-sm" />
                        <button onClick={() => openProductModal()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
                            <AddIcon /> Dodaj
                        </button>
                     </div>
                </CardHeader>
                <CardContent><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr>{['Nazwa', 'Gęstość', 'Szerokość', 'Wysokość', 'Długość', 'Cena netto', 'Zakup netto', 'Transport', 'Netto KL', 'Brutto KL', 'szt./pal', 'pal/auto', 'Akcje'].map((h,i) => <th key={h} scope="col" className={`px-4 py-3 ${i === 0 ? 'w-full' : ''}`}>{h}</th>)}</tr></thead>
                    <tbody>{calculatedProducts.map(p => (<tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-900 align-top">{p.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.density}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.width}mm</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.height}mm</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.length}mm</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatCurrency(p.priceNet || 0)}</td>
                        <td className="px-4 py-2 bg-slate-50 font-semibold text-slate-600 whitespace-nowrap align-top">{formatCurrency(p.netPurchasePrice)}</td>
                        <td className="px-4 py-2 bg-slate-50 whitespace-nowrap align-top">{formatCurrency(p.transportPerUnit)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-700 whitespace-nowrap align-top">{formatCurrency(p.customerNetPrice)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-900 whitespace-nowrap align-top">{formatCurrency(p.customerGrossPrice)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.unitsPerPallet}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.palletsPerTruck}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><div className="flex items-center gap-2">
                            <button onClick={() => openProductModal(p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                        </div></td>
                    </tr>))}</tbody>
                </table></div></CardContent>
            </Card>
             <Modal isOpen={isProductModalOpen} onClose={closeProductModal} title={editingProduct ? 'Edytuj Produkt SOLBET' : 'Dodaj Produkt SOLBET'}>
                <SolbetProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeProductModal} />
            </Modal>
        </div>
    );
};
