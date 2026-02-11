import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getHexagramData, getHexagramId } from '../constants';
import { LineValue } from '../types';
import HexagramDisplay from '../components/HexagramDisplay';

const ReadingDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const reading = useStore((state) => state.readings.find((r) => r.id === id));

    if (!reading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 text-gray-400">
                <p className="mb-4">Reading not found.</p>
                <button 
                    onClick={() => navigate('/journal')}
                    className="text-accent-gold hover:underline"
                >
                    Return to Journal
                </button>
            </div>
        );
    }

    const hexData = getHexagramData(reading.hexagramNumber);
    
    // Derive data if not present (backward compatibility)
    const movingLines = reading.lines.map((val, idx) => ({ val, idx })).filter(item => item.val === 6 || item.val === 9);
    
    let changedHexData = null;
    if (reading.changedHexagramNumber) {
        changedHexData = getHexagramData(reading.changedHexagramNumber);
    } else if (movingLines.length > 0) {
        // Fallback calculation if data missing
        const changedLines = reading.lines.map(l => {
             if (l === 6) return 7; 
             if (l === 9) return 8;
             return l;
        }) as LineValue[];
        
        const changedId = getHexagramId(changedLines);
        changedHexData = getHexagramData(changedId);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 pb-20 max-w-5xl mx-auto animate-fade-in">
             <div className="w-full flex flex-col items-center space-y-12 pb-12">
                
                {/* Header */}
                <div className="text-center space-y-4 w-full">
                    <span className="text-sm uppercase tracking-widest text-primary-glow">
                        {new Date(reading.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <div className="bg-background-dark/50 p-6 rounded-xl border border-white/5 w-full max-w-2xl mx-auto mt-4">
                         <span className="text-xs text-gray-500 uppercase tracking-wide block mb-2">Question</span>
                         <p className="text-xl text-gray-200 italic font-serif">"{reading.question}"</p>
                    </div>
                </div>

                {/* Primary Hexagram Title - Moved Outside */}
                <div className="flex flex-col items-center text-center animate-fade-in -mb-4 pt-4">
                    <span className="text-sm font-bold tracking-[0.2em] text-primary mb-3 uppercase opacity-90">PRIMARY HEXAGRAM</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-wide leading-tight drop-shadow-lg">
                        <span className="text-gray-500 mr-3 opacity-50 font-light text-3xl align-middle">{hexData.number}.</span>
                        {hexData.name}
                    </h1>
                </div>

                {/* Primary Hexagram Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
                    <div className="w-full md:w-auto flex justify-center">
                        <HexagramDisplay 
                            lines={reading.lines} 
                            data={hexData} 
                            label=""
                            showName={true}
                            onlyChineseName={true}
                        />
                    </div>

                    <div className="flex-1 space-y-6 max-w-xl">
                        <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                            <h4 className="text-lg font-serif text-accent-gold mb-2">Judgment</h4>
                            <p className="text-gray-200 leading-relaxed">{hexData.judgment}</p>
                        </div>

                        <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                            <h4 className="text-lg font-serif text-accent-gold mb-2">The Image</h4>
                            <p className="text-gray-200 leading-relaxed">{hexData.image}</p>
                        </div>
                    </div>
                </div>

                {/* Moving Lines */}
                {movingLines.length > 0 && (
                    <div className="w-full max-w-4xl space-y-6">
                        <h3 className="text-2xl font-serif text-white text-center border-t border-white/10 pt-10">The Moving Lines</h3>
                        <div className="grid gap-4">
                            {movingLines.map(({ val, idx }) => (
                                <div key={idx} className="bg-primary/10 border border-primary/30 p-6 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-glow"></div>
                                    <div className="flex items-center gap-4 mb-2">
                                            <span className="text-accent-gold font-bold uppercase tracking-wider text-sm">Line {idx + 1}</span>
                                            <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                                            {val === 6 ? 'Old Yin (Changes to Yang)' : 'Old Yang (Changes to Yin)'}
                                            </span>
                                    </div>
                                    <p className="text-white text-lg italic leading-relaxed">
                                        "{hexData.lines[idx]}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Secondary / Changed Hexagram */}
                {changedHexData && (
                    <div className="w-full space-y-12 pt-10 border-t border-white/10">
                        {/* Transformed Hexagram Title - Moved Outside */}
                        <div className="flex flex-col items-center text-center animate-fade-in -mb-4 pt-4">
                            <span className="text-sm font-bold tracking-[0.2em] text-primary mb-3 uppercase opacity-90">TRANSFORMED HEXAGRAM</span>
                            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-wide leading-tight drop-shadow-lg">
                                <span className="text-gray-500 mr-3 opacity-50 font-light text-3xl align-middle">{changedHexData.number}.</span>
                                {changedHexData.name}
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
                            <div className="w-full md:w-auto flex justify-center">
                                <HexagramDisplay 
                                    lines={reading.lines.map(l => {
                                        if (l === 6) return 7;
                                        if (l === 9) return 8;
                                        return l; 
                                    })} 
                                    data={changedHexData} 
                                    label=""
                                    showName={true}
                                    onlyChineseName={true}
                                />
                            </div>

                            <div className="w-full md:w-2/3 space-y-6">
                                <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-lg font-serif text-accent-gold mb-2">Judgment</h4>
                                    <p className="text-gray-200 leading-relaxed">{changedHexData.judgment}</p>
                                </div>

                                <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-lg font-serif text-accent-gold mb-2">The Image</h4>
                                    <p className="text-gray-200 leading-relaxed">{changedHexData.image}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-8 flex gap-4">
                    <button onClick={() => navigate('/journal')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Journal
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadingDetails;