import React from 'react';

interface CoinProps {
    value: number; // 3 for Yang (Heads), 2 for Yin (Tails)
    isTossing: boolean;
    delay?: number;
}

// Using local images from the /images folder
// Ensure you have 'yang.png' and 'yin.png' in your project's public/images directory
import YANG_IMG from '@/assets/Yang_Coin.png';
import YIN_IMG from '@/assets/Yin_Coin.png';

const Coin: React.FC<CoinProps> = ({ value, isTossing, delay = 0 }) => {
    // Determine target rotation based on value
    // HTML structure: Front is Yin, Back is Yang.
    // If value is 2 (Yin), we want to show Front (0deg).
    // If value is 3 (Yang), we want to show Back (180deg).
    const isYin = value === 2;

    return (
        <div className="coin-container">
            <div className="coin-wrapper">
                <div
                    className={`coin ${isTossing ? 'flipping' : ''}`}
                    style={{
                        // Apply the static rotation when not tossing
                        transform: !isTossing ? (isYin ? 'rotateY(0deg)' : 'rotateY(180deg)') : undefined,
                        // Add delay to the animation start if tossing
                        animationDelay: isTossing ? `${delay}s` : '0s'
                    }}
                >
                    {/* Front Face: Yin */}
                    <div className="coin-face front">
                        <img
                            src={YIN_IMG}
                            alt="Yin Coin"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.style.backgroundColor = '#e5e5e5';
                                    e.currentTarget.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full text-black font-bold text-xl">Yin</span>';
                                }
                            }}
                        />
                    </div>

                    {/* Back Face: Yang */}
                    <div className="coin-face back">
                        <img
                            src={YANG_IMG}
                            alt="Yang Coin"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full text-black font-bold text-xl">Yang</span>';
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                .coin-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .coin-wrapper {
                    perspective: 1000px;
                    width: 100px;
                    height: 100px;
                }

                @media (min-width: 768px) {
                    .coin-wrapper {
                        width: 140px;
                        height: 140px;
                    }
                }

                .coin {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.5s ease-out; /* Smooth settling after toss */
                }

                .coin.flipping {
                    animation: flip 0.8s linear infinite;
                    transition: none;
                }

                @keyframes flip {
                    0% {
                        transform: rotateY(0deg);
                    }
                    100% {
                        transform: rotateY(1080deg); /* Multiple rotations for spinning effect */
                    }
                }

                .coin-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden; /* Safari support */
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 
                        0 15px 50px rgba(0, 0, 0, 0.6),
                        inset 0 3px 15px rgba(255, 255, 255, 0.3),
                        inset 0 -3px 15px rgba(0, 0, 0, 0.3);
                    background-color: #2a2a2a; /* Dark background before image loads */
                }

                .coin-face img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .front {
                    transform: rotateY(0deg);
                }

                .back {
                    transform: rotateY(180deg);
                }

                /* Shine effect */
                .coin-face::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transform: rotate(45deg);
                    animation: shine 2.5s infinite;
                    pointer-events: none;
                }

                @keyframes shine {
                    0% {
                        left: -100%;
                    }
                    50%, 100% {
                        left: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Coin;