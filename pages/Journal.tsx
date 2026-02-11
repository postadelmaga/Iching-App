import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { HEXAGRAMS } from '../constants';

const Journal: React.FC = () => {
    const { readings, deleteReading } = useStore();
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <header className="mb-12 text-center">
                <h2 className="text-4xl font-serif text-white mb-4">Journal of Wisdom</h2>
                <p className="text-gray-400">Reflect on your past consultations.</p>
            </header>

            {readings.length === 0 ? (
                <div className="text-center py-20 bg-card-dark/30 rounded-2xl border border-white/5 border-dashed">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">auto_stories</span>
                    <p className="text-gray-400">Your journal is empty. Cast a hexagram to begin your collection.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {readings.map((reading) => {
                        const hex = HEXAGRAMS[reading.hexagramNumber] || HEXAGRAMS[0];
                        return (
                            <div 
                                key={reading.id} 
                                onClick={() => navigate(`/reading/${reading.id}`)}
                                className="bg-card-dark border border-white/10 rounded-xl p-6 hover:border-accent-gold/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <div className="text-xs font-bold tracking-widest text-primary-glow mb-1">
                                            {new Date(reading.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-serif text-white">{hex.name}</h3>
                                        <p className="text-accent-gold text-sm italic">{hex.chineseName}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteReading(reading.id);
                                        }}
                                        className="self-end md:self-start text-gray-600 hover:text-red-400 transition-colors z-10"
                                        title="Delete Entry"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                
                                <div className="bg-background-dark/50 p-4 rounded-lg border border-white/5 mb-4">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Question</span>
                                    <p className="text-gray-200 italic">"{reading.question}"</p>
                                </div>

                                <div className="text-sm text-gray-400 line-clamp-2 group-hover:line-clamp-none transition-all">
                                    {hex.judgment}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Journal;