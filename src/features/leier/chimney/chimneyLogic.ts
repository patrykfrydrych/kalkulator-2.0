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
    
    const addCommonComponents = (fi: string, pustakSize: string, pustakVent: string) => {
        addItem(items, 'DRK', 1, components, discountMultiplier);
        addItem(items, 'KU', Math.ceil(h / 15), components, discountMultiplier);
        if (options.zakonczenie === 'szalunek') {
            addItem(items, `SCK_${fi}`, 1, components, discountMultiplier);
        } else {
            const wykonczenie = options.wykonczenie === 'tynk' ? 'T' : 'M';
            addItem(items, `CK_${wykonczenie}_${pustakSize}${pustakVent}`, 1, components, discountMultiplier);
        }
        if (options.wykonczenie === 'obmurowka') {
             addItem(items, `PPO_${pustakSize}${pustakVent}`, 1, components, discountMultiplier);
        }
    }

    switch (system) {
        case 'izolowany':
        case 'basic': {
            const { size, fiGroup } = getPustakSizeInfo(fi);
            const pustakVent = options.pustak !== 'bez' ? 'L' : '';
            const ruraKat = options.rurapp === '90' ? '90' : '45';
            
            addItem(items, `PK_${size}${pustakVent}`, Math.ceil(h / 0.335), components, discountMultiplier);
            addItem(items, `RP_${fi}`, Math.ceil((h - 1.485) / 0.33), components, discountMultiplier);
            addItem(items, `RR_${fi}`, 1, components, discountMultiplier);
            addItem(items, `RPP_${ruraKat}_${fi}`, 1, components, discountMultiplier);

            if (system === 'izolowany') {
                addItem(items, `EOS_${fiGroup}`, 1, components, discountMultiplier);
                addItem(items, 'PC', 1, components, discountMultiplier);
                addItem(items, `WM_${fi}`, Math.round(h * 2) / 2, components, discountMultiplier);
                addItem(items, 'KPR', 1, components, discountMultiplier);
            } else { // basic
                 addItem(items, `PC_${fi}`, 1, components, discountMultiplier);
                 addItem(items, 'WI', 3, components, discountMultiplier);
            }
            addItem(items, `OZK_${fi}`, 1, components, discountMultiplier);
            addCommonComponents(fi, size, pustakVent);
            break;
        }
        case 'smart':
        case 'smartplus': {
            const pustakH = options.pustakh === '33' ? 0.33 : 0.245;
            const size = fi === '16' ? '32' : '36';
            const pustakVent = options.pustak === 'bez' ? '' : (options.pustak === 'went' ? 'L' : 'L2');
            const pustakH_suffix = options.pustakh === '25' ? '_245' : '';
            const ruraKat = options.rurapp === '90' ? '90' : '45';
            const { fiGroup } = getPustakSizeInfo(fi);

            addItem(items, `PK_S_${size}${pustakVent}${pustakH_suffix}`, Math.ceil(h / pustakH), components, discountMultiplier);
            addItem(items, `RP_${fi}`, Math.ceil((h - 1.485) / 0.33), components, discountMultiplier);
            addItem(items, `RR_${fi}`, 1, components, discountMultiplier);
            addItem(items, `RPP_${ruraKat}_${fi}`, 1, components, discountMultiplier);
            addItem(items, `EOS_${fiGroup}`, 1, components, discountMultiplier);
            addItem(items, `WM_S_${fi}`, Math.round(h * 2) / 2, components, discountMultiplier);
            addItem(items, system === 'smart' ? `OZK_S_${fi}` : `OZK_SP_${fi}`, 1, components, discountMultiplier);
            addItem(items, 'DRK', 1, components, discountMultiplier);
            addItem(items, 'KPR', 1, components, discountMultiplier);
            addItem(items, 'KU', Math.ceil(h / 15), components, discountMultiplier);
            
            if (options.zakonczenie === 'szalunek') {
                const fiGroupSzalunek: Record<string, string> = {'16': '14-16', '18': '18-20', '20': '18-20'};
                addItem(items, `SCK_S_${fiGroupSzalunek[fi]}`, 1, components, discountMultiplier);
            } else {
                 const wykonczenie = options.wykonczenie === 'tynk' ? 'T' : 'M';
                 addItem(items, `CK_S_${wykonczenie}_${size}${pustakVent}`, 1, components, discountMultiplier);
            }
            break;
        }
        case 'turbo':
        case 'multi':
        case 'turbos':
             alert(`Kalkulacja dla systemu "${system}" nie jest jeszcze zaimplementowana.`);
             return [];
        case 'stal':
            addItem(items, `PV_${options.pustak}`, Math.ceil(h / 0.25), components, discountMultiplier);
            addItem(items, 'STAL_RP_8', Math.floor(h), components, discountMultiplier);
            addItem(items, 'STAL_KOLANO_8', 1, components, discountMultiplier);
            addItem(items, 'STAL_WYCZYSTKA_8', 1, components, discountMultiplier);
            addItem(items, 'STAL_ZAKONCZENIE_8', 1, components, discountMultiplier);
            if (options.redukcja === 'tak') {
                addItem(items, 'STAL_REDUKCJA_8_6', 1, components, discountMultiplier);
            }
            break;
        case 'duostal': {
            const pustakH = options.pustakh === '33' ? 0.33 : 0.245;
            const pustakH_suffix = options.pustakh === '25' ? '_25' : '';
            const ruraKat = options.rurapp === '90' ? '90' : '45';

            addItem(items, `PK_DUO_STAL${pustakH_suffix}`, Math.ceil(h / pustakH), components, discountMultiplier);
            
            // Ceramic part
            addItem(items, `RP_${fi}`, Math.ceil((h - 1.485) / 0.33), components, discountMultiplier);
            addItem(items, `RR_${fi}`, 1, components, discountMultiplier);
            addItem(items, `RPP_${ruraKat}_${fi}`, 1, components, discountMultiplier);
            
            // Steel part
            addItem(items, 'STAL_RP_8', Math.floor(h - 1), components, discountMultiplier);
            addItem(items, 'STAL_WYCZYSTKA_8', 1, components, discountMultiplier);
            addItem(items, 'STAL_KOLANO_8', 1, components, discountMultiplier);
            addItem(items, 'STAL_ZAKONCZENIE_8', 1, components, discountMultiplier);
            if (options.redukcja === 'tak') {
                addItem(items, 'STAL_REDUKCJA_8_6', 1, components, discountMultiplier);
            }
            break;
        }
        case 'duo': {
            alert(`Kalkulacja dla systemu "duo" nie jest jeszcze zaimplementowana.`);
            return [];
        }
        default:
            // This case should not be reached if UI is in sync with this logic
            break;
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
