
import React from 'react';

interface TextAreaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="relative h-full min-h-[300px] md:min-h-0 flex flex-col bg-gem-jet rounded-lg shadow-lg border border-gem-charcoal transition-all duration-300 focus-within:ring-2 focus-within:ring-gem-purple">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-full flex-grow p-4 bg-transparent text-gem-light rounded-lg resize-none focus:outline-none placeholder-gem-slate"
            />
             <div className="text-right p-2 text-xs text-gem-slate border-t border-gem-charcoal">
                {value.length} Zeichen
            </div>
        </div>
    );
};
