import React from 'react';

interface BaguaRingProps {
    radius?: number;
    elementScale?: number;
    className?: string;
}

const BaguaRing: React.FC<BaguaRingProps> = ({ 
    radius = 220, 
    elementScale = 1,
    className = ""
}) => {
    // Trigrams: Bottom to Top order in data (0=bottom line)
    // Display: Top, Right, Bottom, Left... standard Bagua arrangement
    const trigrams = [
        { lines: [1, 1, 1], angle: 0 },    // Top
        { lines: [0, 0, 1], angle: 45 },   // Top-Right
        { lines: [0, 1, 0], angle: 90 },   // Right
        { lines: [1, 0, 0], angle: 135 },  // Bottom-Right
        { lines: [0, 0, 0], angle: 180 },  // Bottom
        { lines: [0, 1, 0], angle: 225 },  // Bottom-Left
        { lines: [1, 0, 1], angle: 270 },  // Left
        { lines: [1, 1, 0], angle: 315 },  // Top-Left
    ];

    return (
        <div 
            className={`absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none ${className}`}
            style={{ animationDuration: '90s' }}
        >
            {trigrams.map((tri, index) => {
                // Calculate position using rotation from center
                return (
                    <div 
                        key={index}
                        className="absolute flex flex-col gap-[4px] items-center justify-center"
                        style={{
                            width: `${40 * elementScale}px`,
                            height: `${20 * elementScale}px`,
                            transform: `rotate(${tri.angle}deg) translateY(-${radius}px)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        <div className="w-full flex flex-col gap-[15%] h-full justify-between">
                            {/* Render lines Top to Bottom (lines[2] is top) */}
                            {[tri.lines[2], tri.lines[1], tri.lines[0]].map((isSolid, i) => (
                                <div 
                                    key={i}
                                    className={`w-full rounded-full ${isSolid ? 'bg-accent-gold' : ''}`}
                                    style={{
                                        height: `${25}%`,
                                        opacity: 0.8,
                                        ...(!isSolid ? {
                                            background: 'linear-gradient(to right, #D4AF37 35%, transparent 35%, transparent 65%, #D4AF37 65%)'
                                        } : {})
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BaguaRing;