import React from 'react';

const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex items-centers h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isOn ? 'bg-slate-700' : 'bg-slate-200'
                }`}
            role="switch"
            aria-checked={isOn}
        >
            {/* Sliding circle without icons */}
            <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${isOn ? 'translate-x-8' : 'translate-x-0.5'
                    }`}
            />
        </button>
    );
};

export default ToggleSwitch;
