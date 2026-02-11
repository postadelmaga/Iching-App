import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaguaRing from '../components/BaguaRing';
import TaoCanvas from '../components/TaoCanvas';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-6 overflow-hidden">
            
            <div className="relative z-10 flex flex-col items-center gap-10 max-w-4xl mx-auto text-center w-full">

                {/* Centered Visualization Area */}
                <div onClick={() => navigate('/oracle')} className="relative group cursor-pointer flex items-center justify-center p-20">
                    
                    {/* Rotating Decorative Rings */}
                    <div className="absolute w-[500px] h-[500px] rounded-full border border-primary/10 animate-spin-slow opacity-30 pointer-events-none"></div>
                    <div className="absolute w-[460px] h-[460px] rounded-full border border-dotted border-accent-gold/10 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '45s' }}></div>

                    {/* The Bagua Ring - Large version for Home */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <BaguaRing radius={210} elementScale={1} />
                    </div>

                    {/* The Tao Canvas Container */}
                    <div className="relative w-[300px] h-[300px] transition-transform duration-700 ease-out group-hover:scale-110 flex items-center justify-center">
                        <TaoCanvas />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 -mt-10 relative z-20">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-none">
                        <span className="text-white block">UNLOCK ANCIENT</span>
                        <span className="text-accent-gold italic font-light block mt-2 drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                            WISDOM
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed pt-4">
                        Consult the oracle for clarity, guidance, and peace in a modern world. The Book of Changes awaits your question.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center gap-4 mt-6 mb-12">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold opacity-60">Begin Your Journey</span>
                    <button 
                        onClick={() => navigate('/oracle')}
                        className="relative group/btn flex items-center justify-center gap-3 bg-primary hover:bg-primary-glow text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 shadow-glow hover:shadow-lg hover:-translate-y-1"
                    >
                        <span>Cast a Hexagram</span>
                        <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;