import { FI_OPTIONS } from './chimneyData';
import type { ChimneySystemType, ReportItem, VentilationData, VentilationItem, ChimneyComponentsData } from './types';

function addItem(items: ReportItem[], componentId: string, quantity: number, components: ChimneyComponentsData, discountMultiplier: number) {
    const component = components[componentId];
    if (component && quantity > 0 && component.price > 0) {
        const price = component.price * discountMultiplier;
        items.push({ name: component.name, price, quantity, total: price * quantity });
    }
}

export function calculateChimneySystem(system: ChimneySystemType, options: any, purchaseDiscount: number, components: ChimneyComponentsData): ReportItem[] | null {
    const h = parseFloat(String(options.h).replace(',', '.'));
    if (isNaN(h) || h < 4 || h > 30) {
        alert('Niepoprawna wysokość komina. Musi być w zakresie 4-30 m.');
        return null;
    }
    
    const fi = options.fi;
    const items: ReportItem[] = [];
    const discountMultiplier = 1 - (purchaseDiscount || 0) / 100;

    const getPustakSizeInfo = (fi: string) => {
        const sizeMap: Record<string, { size: string, fiGroup: string }> = {
            '14': { size: '35', fiGroup: '14-16'}, '16': { size: '35', fiGroup: '14-16' },
            '18': { size: '40', fiGroup: '18-20'}, '20': { size: '40', fiGroup: '18-20' },
            '22': { size: '48', fiGroup: '22'   }, '25': { size: '48', fiGroup: '25'    },
            '30': { size: '57', fiGroup: '30'   }
        };
        return sizeMap[fi] || { size: '', fiGroup: ''};
    };

    switch (system) {
        case 'izolowany':
        case 'basic': {
            const { size } = getPustakSizeInfo(fi);
            const pustakVent = options.pustak !== 'bez' ? 'L' : '';
            
            addItem(items, `PK_${size}${pustakVent}`, Math.ceil(h / 0.335), components, discountMultiplier);
            addItem(items, `RP_${fi}`, Math.ceil((h - 1.485) / 0.33), components, discountMultiplier);
            addItem(items, `RR_${fi}`, 1, components, discountMultiplier);
            
            const ruraKat = options.rurapp === '90' ? '90' : '45';
            addItem(items, `RPP_${ruraKat}_${fi}`, 1, components, discountMultiplier);

            const { fiGroup } = getPustakSizeInfo(fi);

            if (system === 'izolowany') {
                addItem(items, `EOS_${fiGroup}`, 1, components, discountMultiplier);
                addItem(items, 'PC', 1, components, discountMultiplier);

                let welnaQty = Math.round(h);
                welnaQty = h > welnaQty ? welnaQty + 0.5 : (h === welnaQty - 0.5 ? welnaQty - 0.5 : welnaQty);
                addItem(items, `WM_${fi}`, welnaQty, components, discountMultiplier);

            } else { // basic
                 addItem(items, `PC_${fi}`, 1, components, discountMultiplier);
                 addItem(items, 'WI', 3, components, discountMultiplier);
            }
            
            addItem(items, `OZK_${fi}`, 1, components, discountMultiplier);
            addItem(items, 'DRK', 1, components, discountMultiplier);
            
            if (system === 'izolowany') {
                addItem(items, 'KPR', 1, components, discountMultiplier);
            }

            addItem(items, 'KU', Math.ceil(h / 15), components, discountMultiplier);

            if (options.zakonczenie === 'szalunek') {
                addItem(items, `SCK_${fi}`, 1, components, discountMultiplier);
            } else {
                const wykonczenie = options.wykonczenie === 'tynk' ? 'T' : 'M';
                addItem(items, `CK_${wykonczenie}_${size}${pustakVent}`, 1, components, discountMultiplier);
            }
            if (options.wykonczenie === 'obmurowka') {
                 addItem(items, `PPO_${size}${pustakVent}`, 1, components, discountMultiplier);
            }
            break;
        }
        case 'smart':
        case 'smartplus': {
            const pustakH = options.pustakh === '33' ? 0.33 : 0.245;
            const ruraH = 0.33;
            const ruraCount = Math.ceil((h - 1.485) / ruraH);

            const pustakSizeMap: Record<string, string> = {'16': '32', '18': '36', '20': '36'};
            const size = pustakSizeMap[fi] || '';

            const pustakVentMap: Record<string, string> = {'bez': '', 'went': 'L', 'podwojny': 'L2'};
            const pustakVent = pustakVentMap[options.pustak] || '';

            const pustakH_suffix = options.pustakh === '25' ? '_245' : '';

            addItem(items, `PK_S_${size}${pustakVent}${pustakH_suffix}`, Math.ceil(h / pustakH), components, discountMultiplier);
            addItem(items, `RP_${fi}`, ruraCount, components, discountMultiplier);
            addItem(items, `RR_${fi}`, 1, components, discountMultiplier);

            const ruraKat = options.rurapp === '90' ? '90' : '45';
            addItem(items, `RPP_${ruraKat}_${fi}`, 1, components, discountMultiplier);
            
            const { fiGroup } = getPustakSizeInfo(fi);
            
            addItem(items, `EOS_${fiGroup}`, 1, components, discountMultiplier);
            
            let welnaQty = Math.round(h);
            welnaQty = h > welnaQty ? welnaQty + 0.5 : (h === welnaQty - 0.5 ? welnaQty - 0.5 : welnaQty);
            addItem(items, `WM_S_${fi}`, welnaQty, components, discountMultiplier);

            if (system === 'smart') {
                 addItem(items, `OZK_S_${fi}`, 1, components, discountMultiplier);
            } else { // smartplus
                 addItem(items, `OZK_SP_${fi}`, 1, components, discountMultiplier);
            }
            
            addItem(items, 'DRK', 1, components, discountMultiplier);
            addItem(items, 'KPR', 1, components, discountMultiplier);
            addItem(items, 'KU', Math.ceil(h / 15), components, discountMultiplier);
            
            const fiGroupSzalunek: Record<string, string> = {'16': '14-16', '18': '18-20', '20': '18-20'};

            if (options.zakonczenie === 'szalunek') {
                addItem(items, `SCK_S_${fiGroupSzalunek[fi]}`, 1, components, discountMultiplier);
            } else {
                 const wykonczenie = options.wykonczenie === 'tynk' ? 'T' : 'M';
                 addItem(items, `CK_S_${wykonczenie}_${size}${pustakVent}`, 1, components, discountMultiplier);
            }
             if (options.wykonczenie === 'obmurowka') {
                 // No PPO for Smart systems as per observation of form options
            }
            break;
        }

        default:
            alert(`Kalkulacja dla systemu "${system}" nie jest jeszcze zaimplementowana.`);
            return [];
    }
    
    return items;
}

export function calculateVentilation(ventilationData: VentilationData, purchaseDiscount: number, components: ChimneyComponentsData): VentilationItem[] {
    const items: VentilationItem[] = [];
    const discountMultiplier = 1 - (purchaseDiscount || 0) / 100;
    const PUSTAK_HEIGHT = 0.25; // Standard height for ventilation blocks is 25cm

    for (const key in ventilationData) {
        if (Object.prototype.hasOwnProperty.call(ventilationData, key) && ventilationData[key] > 0) {
            const height = ventilationData[key];
            const quantity = Math.ceil(height / PUSTAK_HEIGHT);
            const componentId = `PV_${key}`;
            const component = components[componentId];
            if (component) {
                const price = component.price * discountMultiplier;
                items.push({
                    name: component.name,
                    price,
                    quantity,
                    total: price * quantity,
                });
            }
        }
    }

    return items;
}
