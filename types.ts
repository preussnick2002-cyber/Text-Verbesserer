
export enum ImprovementAction {
    FIX_GRAMMAR = 'FIX_GRAMMAR',
    SUMMARIZE = 'SUMMARIZE',
    EXPAND = 'EXPAND',
    TONE_PROFESSIONAL = 'TONE_PROFESSIONAL',
    TONE_CASUAL = 'TONE_CASUAL',
}

export interface HistoryItem {
  id: number;
  inputText: string;
  outputText: string;
  action: ImprovementAction;
  timestamp: string;
}
