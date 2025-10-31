
import { GoogleGenAI } from "@google/genai";
import { ImprovementAction } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForAction = (text: string, action: ImprovementAction): string => {
    switch (action) {
        case ImprovementAction.FIX_GRAMMAR:
            return `Korrigiere die Rechtschreibung und Grammatik des folgenden Textes. Gib nur den korrigierten Text zurück, ohne einleitende Sätze, Erklärungen oder Formatierungen wie Markdown. Originaltext: "${text}"`;
        case ImprovementAction.SUMMARIZE:
            return `Fasse den folgenden Text kurz und prägnant zusammen. Gib nur die Zusammenfassung zurück. Originaltext: "${text}"`;
        case ImprovementAction.EXPAND:
            return `Erweitere den folgenden Text. Füge relevante Details hinzu, um ihn umfassender zu machen. Gib nur den erweiterten Text zurück. Originaltext: "${text}"`;
        case ImprovementAction.TONE_PROFESSIONAL:
            return `Formuliere den folgenden Text in einem professionellen und formellen Ton um. Gib nur den umformulierten Text zurück. Originaltext: "${text}"`;
        case ImprovementAction.TONE_CASUAL:
            return `Schreibe den folgenden Text in einem lockeren und informellen Ton um. Gib nur den umgeschriebenen Text zurück. Originaltext: "${text}"`;
        default:
            throw new Error('Unbekannte Aktion');
    }
};

const getModelForAction = (action: ImprovementAction): string => {
     switch (action) {
        case ImprovementAction.SUMMARIZE:
        case ImprovementAction.EXPAND:
            return 'gemini-2.5-pro';
        case ImprovementAction.FIX_GRAMMAR:
        case ImprovementAction.TONE_PROFESSIONAL:
        case ImprovementAction.TONE_CASUAL:
        default:
            return 'gemini-2.5-flash';
    }
}


export const improveText = async (text: string, action: ImprovementAction): Promise<string> => {
    try {
        const model = getModelForAction(action);
        const prompt = getPromptForAction(text, action);
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error('Error calling Gemini API:', error);
         if (error instanceof Error) {
            const lowerCaseMessage = error.message.toLowerCase();
            if (lowerCaseMessage.includes('network') || lowerCaseMessage.includes('fetch failed')) {
                throw new Error('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
            }
             if (lowerCaseMessage.includes('400')) {
                throw new Error('Ungültige Anfrage. Der Text konnte nicht verarbeitet werden.');
            }
             if (lowerCaseMessage.includes('429')) {
                throw new Error('Zu viele Anfragen. Bitte warten Sie einen Moment.');
            }
            if (lowerCaseMessage.includes('500') || lowerCaseMessage.includes('503')) {
                throw new Error('Ein serverseitiger Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
            }
        }
        throw new Error('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
};