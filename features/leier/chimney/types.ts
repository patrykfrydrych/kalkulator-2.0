export type ChimneySystemType = 'izolowany' | 'smart' | 'smartplus' | 'basic' | 'turbo' | 'multi' | 'turbos' | 'stal' | 'duostal' | 'duo';

export interface ChimneySystem {
    id: ChimneySystemType;
    name: string;
}

export interface ChimneyOptions {
    izolowany: { h: string; fi: string; pustak: string; wykonczenie: string; zakonczenie: string; rurapp: string; };
    smart: { h: string; fi: string; pustak: string; pustakh: string; wykonczenie: string; zakonczenie: string; rurapp: string; };
    smartplus: { h: string; fi: string; pustak: string; pustakh: string; wykonczenie: string; zakonczenie: string; rurapp: string; };
    basic: { h: string; fi: string; pustak: string; wykonczenie: string; zakonczenie: string; rurapp: string; };
    turbo: { h: string; fi: string; piece: string; pustak: string; wykonczenie: string; zakonczenie: string; };
    multi: { h: string; fi: string; piece: string; pustak: string; wykonczenie: string; zakonczenie: string; };
    turbos: { h: string; fi: string; pustak: string; wykonczenie: string; zakonczenie: string; };
    stal: { h: string; fi: string; pustak: string; redukcja: string; };
    duostal: { h: string; fi: string; fi2: string; pustak: string; pustakh: string; zakonczenie: string; rurapp: string; redukcja: string; };
    duo: { h: string; fi: string; fi2: string; pustak: string; zakonczenie: string; rurapp: string; };
}

export interface ClientData {
    name: string;
    street: string;
    city: string;
    phone: string;
    description: string;
    rabatZakupowyChimney: number;
    rabatZakupowyVent: number;
    marzaChimney: number;
    marzaVent: number;
}

export interface VentilationData {
    [key: string]: number;
}

export interface ReportItem {
    name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface VentilationItem {
    name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface ChimneyComponent {
    id: string;
    name: string;
    price: number;
}

export type ChimneyComponentsData = Record<string, ChimneyComponent>;