import { ImprovementAction } from './types';
import { GrammarIcon, SummarizeIcon, ExpandIcon, ProfessionalIcon, CasualIcon, ToneIcon } from './components/icons';

// The type for an action item, which could have sub-actions
export interface ActionItem {
    id: ImprovementAction | string;
    label: string;
    icon: React.FC<{ className?: string }>;
    subActions?: Omit<ActionItem, 'subActions'>[];
}

export const ACTIONS: ActionItem[] = [
    { id: ImprovementAction.FIX_GRAMMAR, label: 'Grammatik korrigieren', icon: GrammarIcon },
    { id: ImprovementAction.SUMMARIZE, label: 'Zusammenfassen', icon: SummarizeIcon },
    { id: ImprovementAction.EXPAND, label: 'Erweitern', icon: ExpandIcon },
    {
        id: 'TONE_GROUP',
        label: 'Ton ändern',
        icon: ToneIcon,
        subActions: [
            { id: ImprovementAction.TONE_PROFESSIONAL, label: 'Professionell', icon: ProfessionalIcon },
            { id: ImprovementAction.TONE_CASUAL, label: 'Locker', icon: CasualIcon },
        ],
    },
];

// Helper to find an action by ID across the nested structure
export const findActionById = (id: ImprovementAction): Omit<ActionItem, 'subActions'> | undefined => {
    for (const action of ACTIONS) {
        if (action.id === id) {
             const { subActions, ...actionWithoutSubs } = action;
             return actionWithoutSubs;
        }
        if (action.subActions) {
            const subAction = action.subActions.find(sub => sub.id === id);
            if (subAction) return subAction;
        }
    }
    return undefined;
};
