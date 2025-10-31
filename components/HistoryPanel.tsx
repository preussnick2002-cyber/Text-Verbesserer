import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { findActionById } from '../constants';
import { HistoryIcon, TrashIcon, CopyIcon, CheckIcon } from './icons';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelectItem: (item: HistoryItem) => void;
    onDeleteItem: (id: number) => void;
    onClearHistory: () => void;
}

const HistoryListItem: React.FC<{
    item: HistoryItem;
    onSelect: () => void;
    onDelete: () => void;
}> = ({ item, onSelect, onDelete }) => {
    const [copied, setCopied] = useState(false);
    
    const actionLabel = findActionById(item.action)?.label || 'Unbekannt';

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Verhindert, dass onSelect ausgelöst wird
        navigator.clipboard.writeText(item.outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <li 
            className="bg-gem-charcoal p-3 rounded-lg cursor-pointer hover:bg-gem-slate transition-colors duration-200 group"
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect()}
            aria-label={`Verlaufseintrag vom ${new Date(item.timestamp).toLocaleString()}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gem-purple-light font-semibold">{actionLabel}</p>
                    <p className="text-sm text-gem-light mt-1 truncate">{item.inputText}</p>
                    <p className="text-xs text-gem-silver mt-2">{new Date(item.timestamp).toLocaleString('de-DE')}</p>
                </div>
                <div className="flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={handleCopy} className="p-1 text-gem-silver hover:text-white" aria-label="Ausgabe kopieren">
                        {copied ? <CheckIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                    </button>
                    <button onClick={handleDelete} className="p-1 text-gem-silver hover:text-red-400" aria-label="Löschen">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </li>
    );
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, onDeleteItem, onClearHistory }) => {
    return (
        <aside className="h-full flex flex-col bg-gem-jet rounded-lg shadow-lg border border-gem-charcoal">
            <header className="flex items-center justify-between p-4 border-b border-gem-charcoal">
                <div className="flex items-center gap-2">
                    <HistoryIcon className="w-6 h-6 text-gem-purple-light" />
                    <h2 className="text-lg font-bold text-gem-light">Verlauf</h2>
                </div>
                {history.length > 0 && (
                     <button 
                        onClick={onClearHistory}
                        className="flex items-center gap-1 text-sm text-gem-silver hover:text-red-400 transition-colors"
                     >
                        <TrashIcon className="w-4 h-4"/>
                        <span>Alles löschen</span>
                    </button>
                )}
            </header>
            <div className="flex-grow overflow-y-auto p-2">
                {history.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-gem-slate p-4">
                        <p>Ihr Bearbeitungsverlauf wird hier angezeigt.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {history.map(item => (
                            <HistoryListItem 
                                key={item.id}
                                item={item}
                                onSelect={() => onSelectItem(item)}
                                onDelete={() => onDeleteItem(item.id)}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
};