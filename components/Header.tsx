
import React from 'react';
import { GeminiLogo } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="w-full p-4 bg-gem-jet border-b border-gem-charcoal flex items-center justify-center shadow-md">
            <div className="flex items-center space-x-3">
                <GeminiLogo className="w-8 h-8" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gem-purple-light to-gem-light">
                    Text-Verbesserer
                </h1>
            </div>
        </header>
    );
};
