
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ActionToolbar } from './components/ActionToolbar';
import { TextArea } from './components/TextArea';
import { OutputDisplay } from './components/OutputDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { ImprovementAction, HistoryItem } from './types';
import { improveText } from './services/geminiService';
import * as historyService from './services/historyService';
import { ACTIONS } from './constants';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('');
    // FIX: Cast the initial state to ImprovementAction because ACTIONS[0].id is inferred as a wider type `string | ImprovementAction` which is not assignable.
    const [selectedAction, setSelectedAction] = useState<ImprovementAction>(ACTIONS[0].id as ImprovementAction);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Verlauf beim ersten Rendern laden
    useEffect(() => {
        setHistory(historyService.getHistory());
    }, []);

    const handleImproveText = useCallback(async () => {
        if (!inputText.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setOutputText('');

        try {
            const result = await improveText(inputText, selectedAction);
            setOutputText(result);
            // Zum Verlauf hinzufügen
            const updatedHistory = historyService.addHistoryItem({
                inputText,
                outputText: result,
                action: selectedAction,
            });
            setHistory(updatedHistory);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText, selectedAction, isLoading]);

    // Verlaufs-Handler
    const handleSelectItem = (item: HistoryItem) => {
        setInputText(item.inputText);
        setOutputText(item.outputText);
        setSelectedAction(item.action);
    };

    const handleDeleteItem = (id: number) => {
        const updatedHistory = historyService.deleteHistoryItem(id);
        setHistory(updatedHistory);
    };

    const handleClearHistory = () => {
        historyService.clearHistory();
        setHistory([]);
    };

    return (
        <div className="min-h-screen bg-gem-onyx text-gem-light flex flex-col font-sans">
            <Header />
            <main className="flex-grow flex flex-col lg:flex-row p-4 md:p-6 lg:p-8 gap-6 lg:gap-8">
                {/* Verlaufspanel */}
                <div className="lg:w-1/3 xl:w-1/4 flex flex-col min-h-[400px] lg:min-h-0 lg:max-h-[calc(100vh-200px)]">
                    <HistoryPanel
                        history={history}
                        onSelectItem={handleSelectItem}
                        onDeleteItem={handleDeleteItem}
                        onClearHistory={handleClearHistory}
                    />
                </div>

                {/* Hauptinhalt */}
                <div className="flex-grow flex flex-col">
                     <ActionToolbar
                        selectedAction={selectedAction}
                        onActionSelect={setSelectedAction}
                    />
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-4">
                        <TextArea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Geben Sie hier Ihren Text ein..."
                        />
                        <OutputDisplay
                            text={outputText}
                            isLoading={isLoading}
                            error={error}
                            onRetry={handleImproveText}
                        />
                    </div>
                </div>
            </main>
            <footer className="w-full p-4 flex justify-center items-center sticky bottom-0 bg-gem-onyx/80 backdrop-blur-sm border-t border-gem-charcoal">
                 <button
                    onClick={handleImproveText}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full md:w-1/2 lg:w-1/3 px-6 py-3 bg-gem-purple text-white font-bold text-lg rounded-lg shadow-lg hover:bg-gem-purple-light focus:outline-none focus:ring-2 focus:ring-gem-purple-light focus:ring-opacity-50 disabled:bg-gem-slate disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                    {isLoading ? 'Verbessere...' : 'Text verbessern'}
                </button>
            </footer>
        </div>
    );
};

export default App;