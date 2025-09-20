
import type { ChimneyOptions, ChimneySystem, ChimneyComponentsData } from './types';

export const CHIMNEY_SYSTEMS: ChimneySystem[] = [
    { id: 'izolowany', name: 'LEIER IZOLOWANY' },
    { id: 'smart', name: 'LEIER SMART' },
    { id: 'smartplus', name: 'LEIER SMART PLUS' },
    { id: 'basic', name: 'LEIER BASIC' },
    { id: 'turbo', name: 'LEIER TURBO' },
    { id: 'multi', name: 'LEIER MULTI' },
    { id: 'turbos', name: 'LEIER TURBO-S' },
    { id: 'stal', name: 'LEIER STAL' },
    { id: 'duostal', name: 'LEIER DUO STAL' },
    { id: 'duo', name: 'LEIER DUO' }
];

export const FI_OPTIONS = {
    izolowany: ['14', '16', '18', '20', '22', '25', '30'],
    smart: ['16', '18', '20'],
    smartplus: ['16', '18', '20'],
    basic: ['14', '16', '18', '20', '22', '25', '30'],
    turbo: ['14', '16', '18', '20', '22', '25', '30'],
    multi: ['14', '16', '18', '20'],
    turbos: ['8', '10', '12', '14'],
    stal: ['8'],
    duostal: ['18', '20'],
    duo: ['18', '20'],
};

export const FI2_OPTIONS = {
    duostal: ['8'],
    duo: ['8', '10', '12', '14'],
};

export const STAL_PUSTAK_OPTIONS = [
    { value: 'LK1', label: 'LK1 (20x25cm)'},
    { value: 'LK2', label: 'LK2 (36x25cm)'},
    { value: 'LK3', label: 'LK3 (52x25cm)'},
    { value: 'LK4', label: 'LK4 (68x25cm)'},
    { value: 'LK2-P', label: 'LK2-P (46x20cm)'},
    { value: 'LK3-P', label: 'LK3-P (67x20cm)'},
    { value: 'LK4-P', label: 'LK4-P (88x20cm)'},
];

export const INITIAL_CHIMNEY_OPTIONS: ChimneyOptions = {
    izolowany: { h: '6', fi: '18', pustak: 'bez', wykonczenie: 'tynk', zakonczenie: 'szalunek', rurapp: '90' },
    smart: { h: '6', fi: '18', pustak: 'bez', pustakh: '33', wykonczenie: 'tynk', zakonczenie: 'szalunek', rurapp: '90' },
    smartplus: { h: '6', fi: '18', pustak: 'bez', pustakh: '33', wykonczenie: 'tynk', zakonczenie: 'szalunek', rurapp: '90' },
    basic: { h: '6', fi: '18', pustak: 'bez', wykonczenie: 'tynk', zakonczenie: 'szalunek', rurapp: '90' },
    turbo: { h: '6', fi: '14', piece: '1', pustak: 'bez', wykonczenie: 'tynk', zakonczenie: 'szalunek' },
    multi: { h: '6', fi: '14', piece: '1', pustak: 'bez', wykonczenie: 'tynk', zakonczenie: 'szalunek' },
    turbos: { h: '6', fi: '8', pustak: 'bez', wykonczenie: 'tynk', zakonczenie: 'szalunek' },
    stal: { h: '6', fi: '8', pustak: 'LK1', redukcja: 'nie' },
    duostal: { h: '6', fi: '18', fi2: '8', pustak: 'dwu', pustakh: '33', zakonczenie: 'szalunek', rurapp: '90', redukcja: 'nie' },
    duo: { h: '6', fi: '18', fi2: '8', pustak: 'duo', zakonczenie: 'szalunek', rurapp: '90' },
};

export const INITIAL_CHIMNEY_COMPONENTS_DATA: ChimneyComponentsData = {
    // Pustaki Kominowe
    'PK_35': { id: 'PK_35', name: 'Pustak kominowy K35', price: 35.00 },
    'PK_40': { id: 'PK_40', name: 'Pustak kominowy K40', price: 41.00 },
    'PK_48': { id: 'PK_48', name: 'Pustak kominowy K48', price: 54.00 },
    'PK_57': { id: 'PK_57', name: 'Pustak kominowy K57', price: 78.00 },
    'PK_35L': { id: 'PK_35L', name: 'Pustak kominowy K35L (z 1 went.)', price: 52.00 },
    'PK_40L': { id: 'PK_40L', name: 'Pustak kominowy K40L (z 1 went.)', price: 58.00 },
    'PK_48L': { id: 'PK_48L', name: 'Pustak kominowy K48L (z 1 went.)', price: 83.00 },

    // Rury proste
    'RP_14': { id: 'RP_14', name: 'Rura prosta (ø14cm)', price: 26.50 },
    'RP_16': { id: 'RP_16', name: 'Rura prosta (ø16cm)', price: 31.00 },
    'RP_18': { id: 'RP_18', name: 'Rura prosta (ø18cm)', price: 37.00 },
    'RP_20': { id: 'RP_20', name: 'Rura prosta (ø20cm)', price: 44.50 },
    'RP_22': { id: 'RP_22', name: 'Rura prosta (ø22cm)', price: 60.50 },
    'RP_25': { id: 'RP_25', name: 'Rura prosta (ø25cm)', price: 70.00 },
    'RP_30': { id: 'RP_30', name: 'Rura prosta (ø30cm)', price: 85.00 },
    
    // Rury z otworem rewizyjnym
    'RR_14': { id: 'RR_14', name: 'Rura z otworem rewizyjnym (ø14cm)', price: 164.00 },
    'RR_16': { id: 'RR_16', name: 'Rura z otworem rewizyjnym (ø16cm)', price: 175.00 },
    'RR_18': { id: 'RR_18', name: 'Rura z otworem rewizyjnym (ø18cm)', price: 191.00 },
    'RR_20': { id: 'RR_20', name: 'Rura z otworem rewizyjnym (ø20cm)', price: 210.00 },
    'RR_22': { id: 'RR_22', name: 'Rura z otworem rewizyjnym (ø22cm)', price: 255.00 },
    'RR_25': { id: 'RR_25', name: 'Rura z otworem rewizyjnym (ø25cm)', price: 350.00 },
    'RR_30': { id: 'RR_30', name: 'Rura z otworem rewizyjnym (ø30cm)', price: 500.00 },
    
    // Rury podłączenia pieca 90 stopni
    'RPP_90_14': { id: 'RPP_90_14', name: 'Rura podłączenia pieca 90 st. (ø14cm)', price: 165.00 },
    'RPP_90_16': { id: 'RPP_90_16', name: 'Rura podłączenia pieca 90 st. (ø16cm)', price: 175.00 },
    'RPP_90_18': { id: 'RPP_90_18', name: 'Rura podłączenia pieca 90 st. (ø18cm)', price: 191.00 },
    'RPP_90_20': { id: 'RPP_90_20', name: 'Rura podłączenia pieca 90 st. (ø20cm)', price: 210.00 },
    'RPP_90_22': { id: 'RPP_90_22', name: 'Rura podłączenia pieca 90 st. (ø22cm)', price: 255.00 },
    'RPP_90_25': { id: 'RPP_90_25', name: 'Rura podłączenia pieca 90 st. (ø25cm)', price: 350.00 },
    'RPP_90_30': { id: 'RPP_90_30', name: 'Rura podłączenia pieca 90 st. (ø30cm)', price: 500.00 },
    
    // Rury podłączenia pieca 45 stopni
    'RPP_45_14': { id: 'RPP_45_14', name: 'Rura podłączenia pieca 45 st. (ø14cm)', price: 190.00 },
    'RPP_45_16': { id: 'RPP_45_16', name: 'Rura podłączenia pieca 45 st. (ø16cm)', price: 212.00 },
    'RPP_45_18': { id: 'RPP_45_18', name: 'Rura podłączenia pieca 45 st. (ø18cm)', price: 245.00 },
    'RPP_45_20': { id: 'RPP_45_20', name: 'Rura podłączenia pieca 45 st. (ø20cm)', price: 255.00 },
    'RPP_45_22': { id: 'RPP_45_22', name: 'Rura podłączenia pieca 45 st. (ø22cm)', price: 320.00 },
    'RPP_45_25': { id: 'RPP_45_25', name: 'Rura podłączenia pieca 45 st. (ø25cm)', price: 422.00 },
    'RPP_45_30': { id: 'RPP_45_30', name: 'Rura podłączenia pieca 45 st. (ø30cm)', price: 615.00 },
    
    // Elementy odprowadzania skroplin
    'EOS_14-16': { id: 'EOS_14-16', name: 'Element odprowadzania skroplin OD14-16', price: 233.00 },
    'EOS_18-20': { id: 'EOS_18-20', name: 'Element odprowadzania skroplin OD18-20', price: 238.00 },
    'EOS_22': { id: 'EOS_22', name: 'Element odprowadzania skroplin OD22', price: 402.00 },
    'EOS_25': { id: 'EOS_25', name: 'Element odprowadzania skroplin OD25', price: 455.00 },
    'EOS_30': { id: 'EOS_30', name: 'Element odprowadzania skroplin OD30', price: 570.00 },
    
    // Płyta czołowa
    'PC': { id: 'PC', name: 'Płyta czołowa', price: 70.00 },
    'PC_14': { id: 'PC_14', name: 'Płyta czołowa (ø14cm)', price: 45.00 },
    'PC_16': { id: 'PC_16', name: 'Płyta czołowa (ø16cm)', price: 40.00 },
    'PC_18': { id: 'PC_18', name: 'Płyta czołowa (ø18cm)', price: 60.00 },
    'PC_20': { id: 'PC_20', name: 'Płyta czołowa (ø20cm)', price: 60.00 },
    'PC_22': { id: 'PC_22', name: 'Płyta czołowa (ø22cm)', price: 85.00 },
    'PC_25': { id: 'PC_25', name: 'Płyta czołowa (ø25cm)', price: 90.00 },
    'PC_30': { id: 'PC_30', name: 'Płyta czołowa (ø30cm)', price: 120.00 },
    
    // Wełna mineralna
    'WM_14': { id: 'WM_14', name: 'Wełna mineralna (ø14cm)', price: 45.00 },
    'WM_16': { id: 'WM_16', name: 'Wełna mineralna (ø16cm)', price: 40.00 },
    'WM_18': { id: 'WM_18', name: 'Wełna mineralna (ø18cm)', price: 60.00 },
    'WM_20': { id: 'WM_20', name: 'Wełna mineralna (ø20cm)', price: 60.00 },
    'WM_22': { id: 'WM_22', name: 'Wełna mineralna (ø22cm)', price: 85.00 },
    'WM_25': { id: 'WM_25', name: 'Wełna mineralna (ø25cm)', price: 90.00 },
    'WM_30': { id: 'WM_30', name: 'Wełna mineralna (ø30cm)', price: 120.00 },
    
    // Osłona zakończenia komina
    'OZK_14': { id: 'OZK_14', name: 'Osłona zakończenia komina (ø14cm)', price: 260.00 },
    'OZK_16': { id: 'OZK_16', name: 'Osłona zakończenia komina (ø16cm)', price: 265.00 },
    'OZK_18': { id: 'OZK_18', name: 'Osłona zakończenia komina (ø18cm)', price: 285.00 },
    'OZK_20': { id: 'OZK_20', name: 'Osłona zakończenia komina (ø20cm)', price: 300.00 },
    'OZK_22': { id: 'OZK_22', name: 'Osłona zakończenia komina (ø22cm)', price: 330.00 },
    'OZK_25': { id: 'OZK_25', name: 'Osłona zakończenia komina (ø25cm)', price: 420.00 },
    'OZK_30': { id: 'OZK_30', name: 'Osłona zakończenia komina (ø30cm)', price: 450.00 },
    
    // Akcesoria
    'DRK': { id: 'DRK', name: 'Drzwi rewizji komina', price: 300.00 },
    'KPR': { id: 'KPR', name: 'Kratka przewietrzająca', price: 100.00 },
    'KU': { id: 'KU', name: 'Kit uszczelniający', price: 75.00 },
    'WI': { id: 'WI', name: 'Wspornik izolacji', price: 3.00 },

    // Szalunki do czap
    'SCK_14': { id: 'SCK_14', name: 'Szalunek do czapy kominowej (ø14cm)', price: 120.00 },
    'SCK_16': { id: 'SCK_16', name: 'Szalunek do czapy kominowej (ø16cm)', price: 120.00 },
    'SCK_18': { id: 'SCK_18', name: 'Szalunek do czapy kominowej (ø18cm)', price: 120.00 },
    'SCK_20': { id: 'SCK_20', name: 'Szalunek do czapy kominowej (ø20cm)', price: 120.00 },
    'SCK_22': { id: 'SCK_22', name: 'Szalunek do czapy kominowej (ø22cm)', price: 120.00 },
    'SCK_25': { id: 'SCK_25', name: 'Szalunek do czapy kominowej (ø25cm)', price: 130.00 },
    'SCK_30': { id: 'SCK_30', name: 'Szalunek do czapy kominowej (ø30cm)', price: 130.00 },

    // Czapy kominowe pod tynk
    'CK_T_35': { id: 'CK_T_35', name: 'Czapa kominowa pod tynk K35-T', price: 120.00 },
    'CK_T_40': { id: 'CK_T_40', name: 'Czapa kominowa pod tynk K40-T', price: 120.00 },
    'CK_T_48': { id: 'CK_T_48', name: 'Czapa kominowa pod tynk K48-T', price: 135.00 },
    'CK_T_57': { id: 'CK_T_57', name: 'Czapa kominowa pod tynk K57-T', price: 160.00 },
    'CK_T_35L': { id: 'CK_T_35L', name: 'Czapa kominowa pod tynk K35L-T', price: 120.00 },
    'CK_T_40L': { id: 'CK_T_40L', name: 'Czapa kominowa pod tynk K40L-T', price: 140.00 },
    'CK_T_48L': { id: 'CK_T_48L', name: 'Czapa kominowa pod tynk K48L-T', price: 150.00 },
    
    // Czapy kominowe pod obmurówkę
    'CK_M_35': { id: 'CK_M_35', name: 'Czapa kominowa pod obmurówkę K35-M', price: 120.00 },
    'CK_M_40': { id: 'CK_M_40', name: 'Czapa kominowa pod obmurówkę K40-M', price: 125.00 },
    'CK_M_48': { id: 'CK_M_48', name: 'Czapa kominowa pod obmurówkę K48-M', price: 145.00 },
    'CK_M_57': { id: 'CK_M_57', name: 'Czapa kominowa pod obmurówkę K57-M', price: 165.00 },
    'CK_M_35L': { id: 'CK_M_35L', name: 'Czapa kominowa pod obmurówkę K35L-M', price: 120.00 },
    'CK_M_40L': { id: 'CK_M_40L', name: 'Czapa kominowa pod obmurówkę K40L-M', price: 145.00 },
    'CK_M_48L': { id: 'CK_M_48L', name: 'Czapa kominowa pod obmurówkę K48L-M', price: 160.00 },
    
    // Płyty pod obmurówkę
    'PPO_35': { id: 'PPO_35', name: 'Płyta pod obmurówkę K35', price: 85.00 },
    'PPO_40': { id: 'PPO_40', name: 'Płyta pod obmurówkę K40', price: 100.00 },
    'PPO_48': { id: 'PPO_48', name: 'Płyta pod obmurówkę K48', price: 115.00 },
    'PPO_57': { id: 'PPO_57', name: 'Płyta pod obmurówkę K57', price: 140.00 },
    'PPO_35L': { id: 'PPO_35L', name: 'Płyta pod obmurówkę K35L', price: 95.00 },
    'PPO_40L': { id: 'PPO_40L', name: 'Płyta pod obmurówkę K40L', price: 110.00 },
    'PPO_48L': { id: 'PPO_48L', name: 'Płyta pod obmurówkę K48L', price: 125.00 },

    // Pustaki Wentylacyjne
    'PV_LK1': { id: 'PV_LK1', name: 'Pustak wentylacyjny LK1', price: 8.50 },
    'PV_LK2': { id: 'PV_LK2', name: 'Pustak wentylacyjny LK2', price: 13.30 },
    'PV_LK2-40': { id: 'PV_LK2-40', name: 'Pustak wentylacyjny LK2-40', price: 14.00 },
    'PV_LK2-P': { id: 'PV_LK2-P', name: 'Pustak wentylacyjny LK2-P', price: 14.30 },
    'PV_LK3': { id: 'PV_LK3', name: 'Pustak wentylacyjny LK3', price: 19.00 },
    'PV_LK3-P': { id: 'PV_LK3-P', name: 'Pustak wentylacyjny LK3-P', price: 21.50 },
    'PV_LK4': { id: 'PV_LK4', name: 'Pustak wentylacyjny LK4', price: 24.70 },
    'PV_LK4-P': { id: 'PV_LK4-P', name: 'Pustak wentylacyjny LK4-P', price: 28.50 },
    
    // SMART & SMART PLUS
    'PK_S_32': { id: 'PK_S_32', name: 'Pustak kominowy Smart K32', price: 22.50 },
    'PK_S_36': { id: 'PK_S_36', name: 'Pustak kominowy Smart K36', price: 35.00 },
    'PK_S_32_245': { id: 'PK_S_32_245', name: 'Pustak kominowy Smart K32 (h=24,5cm)', price: 26.50 },
    'PK_S_32L': { id: 'PK_S_32L', name: 'Pustak kominowy Smart K32L', price: 31.00 },
    'PK_S_36L': { id: 'PK_S_36L', name: 'Pustak kominowy Smart K36L', price: 46.00 },
    'PK_S_32L_245': { id: 'PK_S_32L_245', name: 'Pustak kominowy Smart K32L (h=24,5cm)', price: 34.50 },
    'PK_S_36L2': { id: 'PK_S_36L2', name: 'Pustak kominowy Smart K36L2', price: 53.00 },
    'PK_S_36L2_245': { id: 'PK_S_36L2_245', name: 'Pustak kominowy Smart K36L2 (h=24,5cm)', price: 40.00 },
    'WM_S_16': { id: 'WM_S_16', name: 'Wełna mineralna Smart (ø16cm)', price: 50.00 },
    'WM_S_18': { id: 'WM_S_18', name: 'Wełna mineralna Smart (ø18cm)', price: 50.00 },
    'WM_S_20': { id: 'WM_S_20', name: 'Wełna mineralna Smart (ø20cm)', price: 50.00 },
    'OZK_S_16': { id: 'OZK_S_16', name: 'Osłona zakończenia komina Smart (ø16cm)', price: 170.00 },
    'OZK_S_18': { id: 'OZK_S_18', name: 'Osłona zakończenia komina Smart (ø18cm)', price: 170.00 },
    'OZK_S_20': { id: 'OZK_S_20', name: 'Osłona zakończenia komina Smart (ø20cm)', price: 170.00 },
    'OZK_SP_16': { id: 'OZK_SP_16', name: 'Osłona zakończenia komina Smart Plus (ø16cm)', price: 265.00 },
    'OZK_SP_18': { id: 'OZK_SP_18', name: 'Osłona zakończenia komina Smart Plus (ø18cm)', price: 285.00 },
    'OZK_SP_20': { id: 'OZK_SP_20', name: 'Osłona zakończenia komina Smart Plus (ø20cm)', price: 300.00 },
    'SCK_S_14-16': { id: 'SCK_S_14-16', name: 'Szalunek do czapy kominowej Smart (ø14-16cm)', price: 120.00 },
    'SCK_S_18-20': { id: 'SCK_S_18-20', name: 'Szalunek do czapy kominowej Smart (ø18-20cm)', price: 120.00 },
    'CK_S_T_32': { id: 'CK_S_T_32', name: 'Czapa kominowa pod tynk Smart K32-T', price: 120.00 },
    'CK_S_T_36': { id: 'CK_S_T_36', name: 'Czapa kominowa pod tynk Smart K36-T', price: 120.00 },
    'CK_S_T_36L': { id: 'CK_S_T_36L', name: 'Czapa kominowa pod tynk Smart K36L-T', price: 140.00 },
    'CK_S_T_36L2': { id: 'CK_S_T_36L2', name: 'Czapa kominowa pod tynk Smart K36L2-T', price: 150.00 },

    // Placeholder components for unimplemented systems
    // STAL
    'STAL_RP_8': { id: 'STAL_RP_8', name: 'Rura stalowa prosta ø80mm (1m)', price: 0.00 },
    'STAL_KOLANO_8': { id: 'STAL_KOLANO_8', name: 'Kolano stalowe 90° ø80mm', price: 0.00 },
    'STAL_WYCZYSTKA_8': { id: 'STAL_WYCZYSTKA_8', name: 'Wyczystka (rewizja) stalowa ø80mm', price: 0.00 },
    'STAL_REDUKCJA_8_6': { id: 'STAL_REDUKCJA_8_6', name: 'Redukcja stalowa ø80/ø60mm', price: 0.00 },
    'STAL_ZAKONCZENIE_8': { id: 'STAL_ZAKONCZENIE_8', name: 'Zakończenie komina stalowego ø80mm', price: 0.00 },
    
    // IZOSTATIC (for Duo)
    'IZO_RP_8': { id: 'IZO_RP_8', name: 'Rura izostatyczna prosta ø80mm', price: 0.00 },
    'IZO_RP_10': { id: 'IZO_RP_10', name: 'Rura izostatyczna prosta ø100mm', price: 0.00 },
    'IZO_RP_12': { id: 'IZO_RP_12', name: 'Rura izostatyczna prosta ø120mm', price: 0.00 },
    'IZO_RP_14': { id: 'IZO_RP_14', name: 'Rura izostatyczna prosta ø140mm', price: 0.00 },
    'IZO_PODLACZENIE_8': { id: 'IZO_PODLACZENIE_8', name: 'Trójnik izostatyczny ø80mm', price: 0.00 },
    'IZO_PODLACZENIE_10': { id: 'IZO_PODLACZENIE_10', name: 'Trójnik izostatyczny ø100mm', price: 0.00 },
    'IZO_PODLACZENIE_12': { id: 'IZO_PODLACZENIE_12', name: 'Trójnik izostatyczny ø120mm', price: 0.00 },
    'IZO_PODLACZENIE_14': { id: 'IZO_PODLACZENIE_14', name: 'Trójnik izostatyczny ø140mm', price: 0.00 },
    'IZO_WYCZYSTKA_8': { id: 'IZO_WYCZYSTKA_8', name: 'Wyczystka izostatyczna ø80mm', price: 0.00 },
    'IZO_WYCZYSTKA_10': { id: 'IZO_WYCZYSTKA_10', name: 'Wyczystka izostatyczna ø100mm', price: 0.00 },
    'IZO_WYCZYSTKA_12': { id: 'IZO_WYCZYSTKA_12', name: 'Wyczystka izostatyczna ø120mm', price: 0.00 },
    'IZO_WYCZYSTKA_14': { id: 'IZO_WYCZYSTKA_14', name: 'Wyczystka izostatyczna ø140mm', price: 0.00 },

    // DUO / DUOSTAL Blocks
    'PK_DUO_STAL': { id: 'PK_DUO_STAL', name: 'Pustak Duo Stal (h=33cm)', price: 0.00 },
    'PK_DUO_STAL_25': { id: 'PK_DUO_STAL_25', name: 'Pustak Duo Stal (h=24,5cm)', price: 0.00 },
    'PK_DUO': { id: 'PK_DUO', name: 'Pustak Duo Ceramika/Izo (h=33cm)', price: 0.00 },
};