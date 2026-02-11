import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { LineValue, Reading, HexagramData } from '../types';
import { getHexagramData, getHexagramId } from '../constants';
import { useNavigate } from 'react-router-dom';
import HexagramDisplay from '../components/HexagramDisplay';

const Oracle: React.FC = () => {
    const navigate = useNavigate();
    const addReading = useStore((state) => state.addReading);
    const [step, setStep] = useState<'question' | 'casting' | 'result'>('question');
    const [question, setQuestion] = useState('');
    const [lines, setLines] = useState<LineValue[]>([]);
    const [tossing, setTossing] = useState(false);
    const [coins, setCoins] = useState<[number, number, number]>([3, 3, 3]); // 3 = Heads (3), 2 = Tails (2)
    const [currentReading, setCurrentReading] = useState<Reading | null>(null);

    const handleStartCasting = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setStep('casting');
        setLines([]);
    };

    const tossCoins = () => {
        if (tossing) return;
        setTossing(true);

        // Animate coins for a bit
        let tosses = 0;
        const interval = setInterval(() => {
            setCoins([
                Math.random() > 0.5 ? 3 : 2,
                Math.random() > 0.5 ? 3 : 2,
                Math.random() > 0.5 ? 3 : 2
            ]);
            tosses++;
            if (tosses > 10) {
                clearInterval(interval);
                finalizeToss();
            }
        }, 100);
    };

    const finalizeToss = () => {
        const c1 = Math.random() > 0.5 ? 3 : 2;
        const c2 = Math.random() > 0.5 ? 3 : 2;
        const c3 = Math.random() > 0.5 ? 3 : 2;
        setCoins([c1, c2, c3]);
        
        const sum = c1 + c2 + c3 as LineValue;
        const newLines = [...lines, sum];
        setLines(newLines);
        setTossing(false);

        if (newLines.length === 6) {
            setTimeout(() => completeReading(newLines), 1000);
        }
    };

    const completeReading = (finalLines: LineValue[]) => {
        // Calculate Primary Hexagram
        const primaryId = getHexagramId(finalLines);

        // Calculate Changed Hexagram
        const hasMoving = finalLines.some(l => l === 6 || l === 9);
        let changedId: number | undefined;

        if (hasMoving) {
            // Apply changes: 6 becomes 7 (Young Yang), 9 becomes 8 (Young Yin)
            // 6 is Old Yin -> Changes to Yang (7)
            // 9 is Old Yang -> Changes to Yin (8)
            // 7 and 8 remain same
            const changedLines = finalLines.map(l => {
                if (l === 6) return 7;
                if (l === 9) return 8;
                return l;
            }) as LineValue[];
            
            changedId = getHexagramId(changedLines);
        }

        const reading: Reading = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            question,
            lines: finalLines,
            hexagramNumber: primaryId,
            changedHexagramNumber: changedId
        };
        
        addReading(reading);
        setCurrentReading(reading);
        setStep('result');
    };

    // Helper for simple rendering during casting
    const renderSimpleLine = (val: LineValue) => {
        const isYang = val === 7 || val === 9;
        return (
            <div className="w-full h-4 flex items-center justify-between gap-2 my-1">
                 {isYang ? (
                    <div className="flex-1 h-full bg-accent-gold rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                 ) : (
                    <>
                        <div className="flex-1 h-full bg-accent-gold rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                        <div className="w-4"></div>
                        <div className="flex-1 h-full bg-accent-gold rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                    </>
                 )}
            </div>
        );
    };

    // Result View Variables
    const primaryHex = currentReading ? getHexagramData(currentReading.hexagramNumber) : null;
    const changedHex = currentReading?.changedHexagramNumber ? getHexagramData(currentReading.changedHexagramNumber) : null;
    const movingLines = currentReading?.lines.map((val, idx) => ({ val, idx })).filter(item => item.val === 6 || item.val === 9) || [];

    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 pb-20 max-w-4xl mx-auto">
            
            {step === 'question' && (
                <div className="w-full flex flex-col items-center animate-fade-in space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif text-center text-white">Ask the Oracle</h2>
                    <p className="text-gray-400 text-center max-w-md">Focus on your question. Be specific, open, and sincere.</p>
                    <form onSubmit={handleStartCasting} className="w-full max-w-md flex flex-col gap-6">
                        <textarea 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What is the nature of my current situation?"
                            className="w-full h-32 bg-card-dark border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all resize-none"
                        />
                        <button 
                            type="submit"
                            disabled={!question.trim()}
                            className="w-full bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full tracking-widest uppercase transition-all shadow-glow"
                        >
                            Focus & Begin
                        </button>
                    </form>
                </div>
            )}

            {step === 'casting' && (
                <div className="w-full flex flex-col items-center space-y-12 animate-fade-in">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-serif text-accent-gold">Casting Line {lines.length + 1} of 6</h3>
                        <p className="text-gray-400 italic">"{question}"</p>
                    </div>

                    {/* Hexagram building area - Simplified for casting */}
                    <div className="w-48 flex flex-col-reverse gap-2 p-4 border border-white/5 rounded-lg bg-card-dark/50 min-h-[160px]">
                        {lines.map((val, idx) => (
                            <div key={idx} className="w-full">{renderSimpleLine(val)}</div>
                        ))}
                         {/* Placeholder lines */}
                         {Array.from({length: 6 - lines.length}).map((_, i) => (
                            <div key={`ph-${i}`} className="w-full h-4 bg-white/5 rounded-sm"></div>
                        ))}
                    </div>

                    {/* Coins */}
                    <div className="flex gap-4">
                        {coins.map((c, i) => (
                            <div key={i} className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-serif border-4 transition-all duration-300 ${tossing ? 'scale-110 border-white text-white' : 'border-accent-gold text-accent-gold shadow-gold-glow bg-black/40'}`}>
                                {c === 3 ? 'Yang' : 'Yin'}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={tossCoins}
                        disabled={tossing}
                        className="bg-transparent border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black px-12 py-3 rounded-full font-bold tracking-widest uppercase transition-all duration-300"
                    >
                        {tossing ? 'Tossing...' : 'Toss Coins'}
                    </button>
                </div>
            )}

            {step === 'result' && primaryHex && currentReading && (
                <div className="w-full flex flex-col items-center space-y-12 animate-fade-in pb-12">
                    
                    {/* Primary Display */}
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
                        <div className="w-full md:w-auto flex justify-center">
                            <HexagramDisplay 
                                lines={currentReading.lines} 
                                data={primaryHex} 
                                label="PRIMARY HEXAGRAM"
                            />
                        </div>

                        <div className="flex-1 space-y-6 max-w-xl">
                            <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                <h4 className="text-lg font-serif text-accent-gold mb-2">Judgment</h4>
                                <p className="text-gray-200 leading-relaxed">{primaryHex.judgment}</p>
                            </div>
                            <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                <h4 className="text-lg font-serif text-accent-gold mb-2">The Image</h4>
                                <p className="text-gray-200 leading-relaxed">{primaryHex.image}</p>
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
                                            "{primaryHex.lines[idx]}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transformed Result */}
                    {changedHex && (
                        <div className="w-full space-y-8 pt-10 border-t border-white/10">
                            <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
                                <div className="w-full md:w-auto flex justify-center">
                                     <HexagramDisplay 
                                        lines={currentReading.lines.map(l => {
                                            if (l === 6) return 7;
                                            if (l === 9) return 8;
                                            return l; // 7->7, 8->8
                                        })} 
                                        data={changedHex} 
                                        label="TRANSFORMED HEXAGRAM"
                                    />
                                </div>

                                <div className="flex-1 space-y-6 max-w-xl">
                                    <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                        <h4 className="text-lg font-serif text-accent-gold mb-2">Judgment</h4>
                                        <p className="text-gray-200 leading-relaxed">{changedHex.judgment}</p>
                                    </div>
                                    <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5">
                                        <h4 className="text-lg font-serif text-accent-gold mb-2">The Image</h4>
                                        <p className="text-gray-200 leading-relaxed">{changedHex.image}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-8 flex gap-4 w-full max-w-lg">
                        <button onClick={() => navigate('/journal')} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors">
                            Save to Journal
                        </button>
                        <button onClick={() => {
                            setStep('question');
                            setQuestion('');
                            setLines([]);
                            setCurrentReading(null);
                        }} className="flex-1 border border-white/20 hover:border-accent-gold text-white hover:text-accent-gold py-3 rounded-lg font-medium transition-all">
                            New Reading
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Oracle;