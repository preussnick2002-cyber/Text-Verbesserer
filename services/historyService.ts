
import { HistoryItem, ImprovementAction } from '../types';

const HISTORY_KEY = 'gemini_text_improver_history';

// Hilfsfunktion zum Abrufen des Verlaufs aus dem localStorage
export const getHistory = (): HistoryItem[] => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
        console.error('Fehler beim Lesen des Verlaufs aus dem localStorage:', error);
        return [];
    }
};

// Hilfsfunktion zum Hinzufügen eines Eintrags zum Verlauf
export const addHistoryItem = (item: {
    inputText: string;
    outputText: string;
    action: ImprovementAction;
}): HistoryItem[] => {
    try {
        const history = getHistory();
        const newHistoryItem: HistoryItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...item,
        };
        const updatedHistory = [newHistoryItem, ...history];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    } catch (error) {
        console.error('Fehler beim Speichern des Verlaufs im localStorage:', error);
        return getHistory(); // Gibt den vorhandenen Verlauf bei einem Fehler zurück
    }
};

// Hilfsfunktion zum Löschen eines Eintrags
export const deleteHistoryItem = (id: number): HistoryItem[] => {
    try {
        const history = getHistory();
        const updatedHistory = history.filter((item) => item.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    } catch (error) {
        console.error('Fehler beim Löschen eines Verlaufseintrags aus dem localStorage:', error);
        return getHistory();
    }
};

// Hilfsfunktion zum Leeren des gesamten Verlaufs
export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Fehler beim Leeren des Verlaufs aus dem localStorage:', error);
    }
};
