export type LineValue = 6 | 7 | 8 | 9;

export interface Trigram {
    name: string;
    chineseName: string;
    nature: string;
    lines: [number, number, number]; // 0 for broken, 1 for solid (bottom to top)
    attribute: string;
}

export interface HexagramData {
    number: number;
    name: string;
    chineseName: string;
    judgment: string;
    image: string;
    lines: string[]; // Interpretations for lines 1-6
}

export interface Reading {
    id: string;
    timestamp: number;
    question: string;
    lines: LineValue[];
    hexagramNumber: number;
    changedHexagramNumber?: number;
    notes?: string;
}

export type ThemeMode = 'light' | 'dark';
