import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TRIGRAMS, HEXAGRAMS, getStructureForHexagram } from '../constants';
import TaoCanvas from '../components/TaoCanvas';

const Book: React.FC = () => {
  const navigate = useNavigate();
  
  const getIconForNature = (nature: string): string => {
    switch (nature) {
        case 'Sky': return 'cloud';
        case 'Earth': return 'public';
        case 'Thunder': return 'flash_on';
        case 'Water': return 'water_drop';
        case 'Mountain': return 'terrain';
        case 'Wind': return 'air';
        case 'Fire': return 'local_fire_department';
        case 'Lake': return 'waves';
        default: return 'circle';
    }
  };

  // Renderer for Trigrams (3 lines)
  const renderTrigramLines = (lines: number[]) => {
    // lines are defined [bottom, middle, top] in constants
    // visually we stack them Top -> Bottom, so we reverse the array for display
    return (
        <div className="flex flex-col gap-2 w-20">
            {[...lines].reverse().map((line, i) => (
                <div key={i} className="flex justify-between h-3 w-full">
                    {line === 1 ? (
                        <div className="w-full bg-accent-gold rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                    ) : (
                        <>
                            <div className="w-[42%] bg-accent-gold rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                            <div className="w-[16%]"></div>
                            <div className="w-[42%] bg-accent-gold rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
  };

  // Renderer for Hexagrams (6 lines) - Simplified for grid
  const renderHexagramLines = (structure: number[]) => {
      // Structure is [bottom, ... , top]. Reverse for display (Top -> Bottom)
      return (
          <div className="flex flex-col gap-[3px] w-12 opacity-80 group-hover:opacity-100 transition-opacity">
              {[...structure].reverse().map((lineVal, i) => ( // 7=solid, 8=broken
                  <div key={i} className="flex justify-between h-1.5 w-full">
                       {lineVal === 7 ? (
                          <div className="w-full bg-accent-gold rounded-[1px]"></div>
                       ) : (
                          <>
                              <div className="w-[42%] bg-accent-gold rounded-[1px]"></div>
                              <div className="w-[16%]"></div>
                              <div className="w-[42%] bg-accent-gold rounded-[1px]"></div>
                          </>
                       )}
                  </div>
              ))}
          </div>
      );
  };

  // Prepare grid items: Insert Tao at index 4 to make a 3x3 grid with center
  const gridItems = [
      ...TRIGRAMS.slice(0, 4),
      'TAO',
      ...TRIGRAMS.slice(4, 8)
  ];

  // Hexagram list 1-64
  const hexagramKeys = Array.from({length: 64}, (_, i) => i + 1);

  return (
    <div className="min-h-screen pt-12 px-6 pb-20 max-w-7xl mx-auto animate-fade-in flex flex-col items-center">
        
        {/* Intro Section */}
        <header className="text-center mb-20 space-y-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">The Book of Changes</h1>
            <div className="w-20 h-0.5 bg-accent-gold mx-auto opacity-70"></div>
            <div className="text-gray-400 leading-relaxed font-light text-lg space-y-4">
                <p>
                    The I Ching (Yi Jing) is one of the oldest and most profound divination texts in the world, originating in ancient China over 3,000 years ago. At its core, it is a system of symbols designed to represent the dynamic balance of opposites and the inevitability of change.
                </p>
                <p>
                    Wisdom is encoded in 64 Hexagrams, each composed of two Trigrams (Bagua). These symbols describe the patterns of the universe and offer guidance for aligning oneself with the Tao.
                </p>
            </div>
        </header>

        {/* Trigrams Section */}
        <div className="w-full max-w-6xl mb-24">
             <h2 className="text-2xl font-serif text-accent-gold text-center mb-10 tracking-widest uppercase opacity-80">The Eight Trigrams (Bagua)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridItems.map((item, idx) => {
                    if (item === 'TAO') {
                        // Hidden on mobile/tablet (8 items -> 2 cols), Visible on Large (9 items -> 3 cols)
                        return (
                            <div key="center-tao" className="hidden lg:flex relative items-center justify-center aspect-square pointer-events-none">
                                <div className="w-96 h-96">
                                    <TaoCanvas />
                                </div>
                            </div>
                        );
                    }

                    const trigram = item as typeof TRIGRAMS[0];
                    return (
                        <div key={idx} className="bg-card-dark border border-white/10 p-8 rounded-xl hover:border-accent-gold/50 transition-all duration-500 group hover:-translate-y-1 hover:shadow-gold-glow relative overflow-hidden flex flex-col items-center justify-between text-center gap-6 min-h-[320px]">
                            
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 group-hover:to-accent-gold/5 transition-colors duration-500 pointer-events-none"></div>

                            {/* Top Section: Icon & Names */}
                            <div className="flex flex-col items-center z-10 w-full">
                                <div className="flex items-center justify-center gap-4 mb-2">
                                     <span className="material-symbols-outlined text-3xl text-white/50 group-hover:text-accent-gold transition-colors duration-300">
                                        {getIconForNature(trigram.nature)}
                                    </span>
                                    <h3 className="text-2xl font-serif font-bold text-accent-gold tracking-wide">
                                        {trigram.name}
                                    </h3>
                                </div>
                                <span className="text-sm font-serif italic text-gray-500 group-hover:text-gray-300 transition-colors">
                                    {trigram.chineseName}
                                </span>
                            </div>

                            {/* Middle: Trigram Symbol */}
                            <div className="py-4 z-10 scale-125 group-hover:scale-135 transition-transform duration-500 ease-out">
                                {renderTrigramLines(trigram.lines)}
                            </div>

                            {/* Bottom: Attributes */}
                            <div className="z-10 w-full border-t border-white/5 pt-4 mt-2">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                                    {trigram.nature}
                                </div>
                                <div className="text-sm text-gray-500 font-serif">
                                    {trigram.attribute}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>

        {/* Hexagrams Grid Section */}
        <div className="w-full max-w-7xl">
            <h2 className="text-2xl font-serif text-accent-gold text-center mb-10 tracking-widest uppercase opacity-80">The 64 Hexagrams (King Wen Sequence)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {hexagramKeys.map((num) => {
                    const hex = HEXAGRAMS[num];
                    const structure = getStructureForHexagram(num);

                    return (
                        <div 
                            key={num}
                            onClick={() => navigate(`/hexagram/${num}`)}
                            className="bg-card-dark border border-white/10 p-4 rounded-lg hover:border-accent-gold hover:bg-white/5 cursor-pointer transition-all duration-300 group flex flex-col items-center gap-3 text-center relative"
                        >
                            <div className="mt-2">
                                {renderHexagramLines(structure)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white line-clamp-1">
                                    <span className="text-accent-gold mr-1">{num}.</span>
                                    {hex.name}
                                </span>
                                <span className="text-[10px] text-gray-500 italic">{hex.chineseName}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default Book;