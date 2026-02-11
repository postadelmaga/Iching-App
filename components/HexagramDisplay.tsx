import React from 'react';
import { LineValue, HexagramData } from '../types';
import { getTrigram } from '../constants';

interface HexagramDisplayProps {
    lines: LineValue[];
    data: HexagramData;
    label?: string;
    showTrigrams?: boolean;
    showName?: boolean;
    onlyChineseName?: boolean;
    className?: string;
}

const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ 
    lines, 
    data, 
    label, 
    showTrigrams = true,
    showName = true,
    onlyChineseName = false,
    className = "" 
}) => {
    // Split lines into lower (0-2) and upper (3-5) sets
    const lowerLines = lines.slice(0, 3);
    const upperLines = lines.slice(3, 6);

    const lowerTrigram = getTrigram(lowerLines);
    const upperTrigram = getTrigram(upperLines);

    // Helper to render a single line
    const renderLine = (val: LineValue, index: number) => {
        const isYang = val === 7 || val === 9;
        const isMoving = val === 6 || val === 9;
        
        // Style Logic:
        // Standard (Static) Lines -> White/Gray (bg-gray-200)
        // Moving Lines -> Purple (bg-primary)
        
        const colorClass = isMoving ? "bg-primary shadow-[0_0_10px_rgba(115,17,212,0.6)]" : "bg-gray-200 shadow-[0_0_5px_rgba(255,255,255,0.2)]";

        return (
            <div key={index} className="w-full h-6 flex items-center justify-between gap-4">
                 {isYang ? (
                    // Solid Line
                    <div className={`flex-1 h-full rounded-md ${colorClass} transition-colors duration-500`}></div>
                 ) : (
                    // Broken Line
                    <>
                        <div className={`flex-1 h-full rounded-md ${colorClass} transition-colors duration-500`}></div>
                        <div className="w-6"></div> {/* Gap */}
                        <div className={`flex-1 h-full rounded-md ${colorClass} transition-colors duration-500`}></div>
                    </>
                 )}
                 {/* Optional: Indicator dot for moving lines if we want extra emphasis */}
                 {isMoving && (
                     <div className="absolute -right-6 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                 )}
            </div>
        );
    };

    return (
        <div className={`flex flex-col items-center bg-card-dark p-8 rounded-2xl border border-white/5 shadow-2xl w-full max-w-sm ${className}`}>
            {/* Header */}
            <div className={`text-center w-full ${showName ? 'mb-8' : 'mb-6'}`}>
                {label && <div className="text-sm font-bold tracking-[0.2em] text-primary mb-3 uppercase opacity-90">{label}</div>}
                
                {showName && (
                    <>
                        {!onlyChineseName && (
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-2">
                                <span className="text-gray-500 mr-2 opacity-50 font-light text-2xl align-middle">{data.number}.</span>
                                {data.name}
                            </h2>
                        )}
                        
                        <div className="text-xl font-serif text-accent-gold italic opacity-80">{data.chineseName}</div>
                    </>
                )}
            </div>

            {/* Hexagram Lines (Rendered Bottom to Top via flex-col-reverse) */}
            <div className={`flex flex-col-reverse gap-3 w-48 relative ${showName ? 'mb-8' : 'mb-6'}`}>
                {lines.map((val, idx) => renderLine(val, idx))}
            </div>

            {/* Trigram Footer */}
            {showTrigrams && lowerTrigram && upperTrigram && (
                <div className="w-full flex justify-between px-4 pt-6 border-t border-white/10 mt-auto">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Upper</span>
                        <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary text-lg">
                                 {getIconForNature(upperTrigram.nature)}
                             </span>
                             <span className="font-bold text-gray-200">{upperTrigram.nature}</span>
                        </div>
                        <span className="text-xs text-gray-500 italic">{upperTrigram.chineseName}</span>
                    </div>

                    <div className="flex flex-col items-center">
                         <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Lower</span>
                         <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary text-lg">
                                 {getIconForNature(lowerTrigram.nature)}
                             </span>
                             <span className="font-bold text-gray-200">{lowerTrigram.nature}</span>
                        </div>
                        <span className="text-xs text-gray-500 italic">{lowerTrigram.chineseName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for icons based on Nature
function getIconForNature(nature: string): string {
    switch (nature.toLowerCase()) {
        case 'sky': return 'cloud';
        case 'earth': return 'public'; // or landscape
        case 'thunder': return 'flash_on';
        case 'water': return 'water_drop';
        case 'mountain': return 'terrain';
        case 'wind': return 'air';
        case 'fire': return 'local_fire_department';
        case 'lake': return 'water'; // or waves
        default: return 'circle';
    }
}

export default HexagramDisplay;