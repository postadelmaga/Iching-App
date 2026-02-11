import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHexagramData, getStructureForHexagram } from '../constants';
import HexagramDisplay from '../components/HexagramDisplay';

const HexagramDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hexId = parseInt(id || '1', 10);
    const hexData = getHexagramData(hexId);
    
    // Get static structure (all lines are either 7 (Yang) or 8 (Yin) for display)
    const structure = getStructureForHexagram(hexId);

    // Navigation handlers
    const prevId = hexId > 1 ? hexId - 1 : 64;
    const nextId = hexId < 64 ? hexId + 1 : 1;

    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 pb-20 max-w-6xl mx-auto animate-fade-in">
             <div className="w-full flex flex-col items-center space-y-12 pb-12">
                
                {/* Header Container */}
                <div className="w-full max-w-5xl">
                    {/* Navigation Row: Arrows + Number */}
                    <div className="relative flex items-center justify-between px-2 md:px-4 py-4">
                        {/* Prev Button */}
                        <button 
                            onClick={() => navigate(`/hexagram/${prevId}`)}
                            className="text-gray-500 hover:text-accent-gold transition-colors flex items-center gap-2 group p-2 z-10"
                            title={`Go to Hexagram ${prevId}`}
                        >
                            <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span className="hidden md:inline font-serif text-sm tracking-widest uppercase">Prev</span>
                        </button>
                        
                        {/* Number (Absolutely Centered) */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-4xl md:text-5xl font-serif font-bold text-primary shadow-purple-500/20 drop-shadow-sm">
                                {hexId}
                            </span>
                        </div>

                        {/* Next Button */}
                        <button 
                            onClick={() => navigate(`/hexagram/${nextId}`)}
                            className="text-gray-500 hover:text-accent-gold transition-colors flex items-center gap-2 group p-2 z-10"
                            title={`Go to Hexagram ${nextId}`}
                        >
                            <span className="hidden md:inline font-serif text-sm tracking-widest uppercase">Next</span>
                            <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    {/* Title Row */}
                    <div className="flex flex-col items-center text-center mt-2 animate-fade-in">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white font-bold tracking-wide leading-tight drop-shadow-md uppercase">
                            {hexData.name}
                        </h1>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full mt-4">
                    
                    {/* Left Column: Hexagram Display */}
                    <div className="w-full md:w-auto flex justify-center md:justify-end">
                        <HexagramDisplay 
                            lines={structure} 
                            data={hexData} 
                            label=""
                            showName={true}
                            onlyChineseName={true}
                            className="w-full max-w-[320px]" 
                        />
                    </div>

                    {/* Right Column: Text Boxes */}
                    <div className="flex-1 flex flex-col gap-6 max-w-2xl">
                        
                        {/* Judgment */}
                        <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5 hover:border-accent-gold/30 transition-all group shadow-md hover:shadow-gold-glow/10">
                            <h4 className="text-lg font-serif text-accent-gold mb-2">Judgment</h4>
                            <p className="text-gray-300 italic leading-relaxed group-hover:text-white transition-colors text-lg">
                                {hexData.judgment}
                            </p>
                        </div>


                        {/* Image */}
                        <div className="bg-card-dark/50 p-6 rounded-xl border border-white/5 hover:border-accent-gold/30 transition-all group shadow-md hover:shadow-gold-glow/10">
                            <h4 className="text-lg font-serif text-accent-gold mb-2">The Image</h4>
                            <p className="text-gray-300 italic leading-relaxed group-hover:text-white transition-colors text-lg">
                                {hexData.image}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Changing Lines */}
                <div className="w-full max-w-4xl space-y-8">
                    <h3 className="text-2xl font-serif text-white text-center border-t border-white/10 pt-12 pb-4 tracking-wider opacity-90">Changing Lines</h3>
                    <div className="grid gap-4">
                        {hexData.lines.map((text, idx) => {
                            const lineNum = idx + 1;
                            
                            return (
                                <div key={idx} className="bg-card-dark border border-white/10 p-6 rounded-xl hover:border-primary/30 transition-all group shadow-md hover:shadow-glow/10">
                                    <div className="flex flex-row gap-6 items-start">
                                        {/* Small Hexagram Indicator */}
                                         <div className="flex flex-col gap-[4px] w-12 min-w-[3rem] opacity-90 pt-1 select-none">
                                            {[...structure].reverse().map((lineVal, i) => {
                                                const logicalIndex = 5 - i; // 0 is bottom
                                                const isActive = logicalIndex === idx;
                                                // Purple for active line
                                                const colorClass = isActive ? "bg-primary shadow-[0_0_8px_rgba(115,17,212,0.8)] opacity-100" : "bg-white/10 opacity-50";
                                                
                                                return (
                                                    <div key={i} className="flex justify-between h-2 w-full">
                                                        {lineVal === 7 ? (
                                                            <div className={`w-full ${colorClass} rounded-[1px] transition-all`}></div>
                                                        ) : (
                                                            <>
                                                                <div className={`w-[40%] ${colorClass} rounded-[1px] transition-all`}></div>
                                                                <div className="w-[20%]"></div>
                                                                <div className={`w-[40%] ${colorClass} rounded-[1px] transition-all`}></div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex flex-col">
                                             <span className="text-xs text-primary font-bold uppercase tracking-widest mb-1 opacity-90">Line {lineNum}</span>
                                             <p className="text-gray-300 italic leading-relaxed group-hover:text-white transition-colors text-lg">
                                                "{text}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-8 flex gap-4">
                    <button onClick={() => navigate('/book')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/5">
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            Back to Book
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HexagramDetail;