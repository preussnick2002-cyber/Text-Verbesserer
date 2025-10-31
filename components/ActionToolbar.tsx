import React, { useState, useEffect, useRef } from 'react';
import { ImprovementAction } from '../types';
import { ACTIONS, ActionItem } from '../constants';

interface ActionToolbarProps {
    selectedAction: ImprovementAction;
    onActionSelect: (action: ImprovementAction) => void;
}

const DropdownAction: React.FC<{
    actionGroup: ActionItem;
    selectedAction: ImprovementAction;
    onActionSelect: (action: ImprovementAction) => void;
}> = ({ actionGroup, selectedAction, onActionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSubActionSelected = actionGroup.subActions?.some(sub => sub.id === selectedAction);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const ChevronIcon: React.FC<{className?: string}> = ({ className }) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isSubActionSelected
                        ? 'bg-gem-purple text-white shadow-md'
                        : 'bg-gem-charcoal text-gem-silver hover:bg-gem-slate hover:text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <actionGroup.icon className="w-5 h-5" />
                <span>{actionGroup.label}</span>
                <ChevronIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-gem-charcoal border border-gem-slate rounded-lg shadow-xl z-10" role="menu">
                    <ul className="py-1">
                        {actionGroup.subActions?.map(subAction => (
                            <li key={subAction.id} role="none">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onActionSelect(subAction.id as ImprovementAction);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left ${
                                        selectedAction === subAction.id 
                                            ? 'bg-gem-purple text-white' 
                                            : 'text-gem-silver hover:bg-gem-slate hover:text-white'
                                    }`}
                                    role="menuitem"
                                >
                                    <subAction.icon className="w-5 h-5" />
                                    <span>{subAction.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export const ActionToolbar: React.FC<ActionToolbarProps> = ({ selectedAction, onActionSelect }) => {
    return (
        <div className="w-full bg-gem-jet p-2 rounded-lg shadow-inner">
            <div className="flex flex-wrap items-center justify-center gap-2">
                {ACTIONS.map((action) => {
                    if (action.subActions) {
                        return (
                            <DropdownAction
                                key={action.id}
                                actionGroup={action}
                                selectedAction={selectedAction}
                                onActionSelect={onActionSelect}
                            />
                        );
                    }
                    return (
                        <button
                            key={action.id}
                            onClick={() => onActionSelect(action.id as ImprovementAction)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                selectedAction === action.id
                                    ? 'bg-gem-purple text-white shadow-md'
                                    : 'bg-gem-charcoal text-gem-silver hover:bg-gem-slate hover:text-white'
                            }`}
                        >
                            <action.icon className="w-5 h-5" />
                            <span>{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
