import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { formatCurrency } from '../../../../services/exportService';
import type { ReportItem, VentilationItem, ClientData, ChimneySystemType } from '../types';

interface ChimneyReportProps {
    systemName: string;
    systemType: ChimneySystemType;
    options: any;
    items: ReportItem[];
    ventilationItems: VentilationItem[];
    clientData: ClientData;
    onQuantityChange: (index: number, delta: number) => void;
}

export const ChimneyReport: React.FC<ChimneyReportProps> = ({ systemName, systemType, options, items, ventilationItems, clientData, onQuantityChange }) => {
    
    const chimneyTotalNet = items.reduce((sum, item) => sum + item.total, 0);
    const chimneyTotalNetAfterMargin = chimneyTotalNet * (1 + clientData.marzaChimney / 100);
    const chimneyTotalGrossAfterMargin = chimneyTotalNetAfterMargin * 1.23;

    const ventTotalNet = ventilationItems.reduce((sum, item) => sum + item.total, 0);
    const ventTotalNetAfterMargin = ventTotalNet * (1 + clientData.marzaVent / 100);
    const ventTotalGrossAfterMargin = ventTotalNetAfterMargin * 1.23;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Podsumowanie Kalkulacji</CardTitle>
                    <p className="text-sm text-slate-500">{systemName}</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong className="block text-slate-600">Wysokość:</strong> {options.h} m</div>
                        <div><strong className="block text-slate-600">Średnica:</strong> ø{options.fi} cm</div>
                        {options.fi2 && <div><strong className="block text-slate-600">Druga średnica:</strong> ø{options.fi2} cm</div>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Zestawienie Elementów Kominowych</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Lp.</th>
                                    <th className="px-4 py-3 text-left w-2/4">Element</th>
                                    <th className="px-4 py-3 text-center">Ilość</th>
                                    <th className="px-4 py-3 text-right">Cena jedn. netto</th>
                                    <th className="px-4 py-3 text-right">Wartość netto</th>
                                    <th className="px-4 py-3 text-center">+/-</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{item.name}</td>
                                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => onQuantityChange(index, 1)} className="px-2 py-0.5 bg-slate-200 rounded hover:bg-slate-300">+</button>
                                                <button onClick={() => onQuantityChange(index, -1)} className="px-2 py-0.5 bg-slate-200 rounded hover:bg-slate-300">-</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-100 font-semibold">
                                    <td colSpan={4} className="px-4 py-2 text-right">Suma netto (zakup):</td>
                                    <td className="px-4 py-2 text-right">{formatCurrency(chimneyTotalNet)}</td>
                                    <td></td>
                                </tr>
                                {clientData.marzaChimney > 0 && (
                                     <tr className="bg-blue-50 font-bold text-blue-800">
                                        <td colSpan={4} className="px-4 py-2 text-right">Wartość netto po marży ({clientData.marzaChimney}%):</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(chimneyTotalNetAfterMargin)}</td>
                                        <td></td>
                                    </tr>
                                )}
                                <tr className="bg-slate-200 font-bold">
                                    <td colSpan={4} className="px-4 py-2 text-right">Suma brutto (po marży):</td>
                                    <td className="px-4 py-2 text-right">{formatCurrency(chimneyTotalGrossAfterMargin)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {ventilationItems.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Zestawienie Pustaków Wentylacyjnych</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Lp.</th>
                                        <th className="px-4 py-3 text-left w-3/5">Element</th>
                                        <th className="px-4 py-3 text-center">Ilość</th>
                                        <th className="px-4 py-3 text-right">Cena jedn. netto</th>
                                        <th className="px-4 py-3 text-right">Wartość netto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {ventilationItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{item.name}</td>
                                            <td className="px-4 py-2 text-center">{item.quantity}</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-100 font-semibold">
                                        <td colSpan={4} className="px-4 py-2 text-right">Suma netto (zakup):</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(ventTotalNet)}</td>
                                    </tr>
                                     {clientData.marzaVent > 0 && (
                                        <tr className="bg-blue-50 font-bold text-blue-800">
                                            <td colSpan={4} className="px-4 py-2 text-right">Wartość netto po marży ({clientData.marzaVent}%):</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(ventTotalNetAfterMargin)}</td>
                                        </tr>
                                    )}
                                    <tr className="bg-slate-200 font-bold">
                                        <td colSpan={4} className="px-4 py-2 text-right">Suma brutto (po marży):</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(ventTotalGrossAfterMargin)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
