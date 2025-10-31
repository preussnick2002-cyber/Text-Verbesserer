
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { CopyIcon, CheckIcon, ErrorIcon } from './icons';

interface OutputDisplayProps {
    text: string;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ text, isLoading, error, onRetry }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);
    
    useEffect(() => {
        // Reset copied state when new text arrives
        setCopied(false);
    }, [text]);

    const handleCopy = () => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gem-silver">
                    <LoadingSpinner />
                    <p className="mt-4">KI denkt nach...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
                    <ErrorIcon className="w-12 h-12 mb-4" />
                    <p className="font-semibold">Ein Fehler ist aufgetreten</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button
                        onClick={onRetry}
                        className="mt-6 px-4 py-2 bg-red-500/20 text-red-300 font-semibold rounded-lg hover:bg-red-500/40 transition-colors"
                    >
                        Erneut versuchen
                    </button>
                </div>
            );
        }
        
        if (!text) {
             return <p className="text-gem-slate">Ihr verbesserter Text wird hier angezeigt...</p>;
        }

        return <p className="whitespace-pre-wrap">{text}</p>;
    };

    return (
        <div className="relative h-full min-h-[300px] md:min-h-0 flex flex-col bg-gem-jet rounded-lg shadow-lg border border-gem-charcoal p-4">
            <div className="flex-grow overflow-y-auto text-gem-light flex items-center justify-center">
                {renderContent()}
            </div>
            {text && !isLoading && !error && (
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 rounded-md bg-gem-charcoal hover:bg-gem-slate text-gem-silver transition-colors"
                    aria-label="Kopieren"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
};