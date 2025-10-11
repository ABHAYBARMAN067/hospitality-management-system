import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <span className="sr-only">Toggle color theme</span>
            <span
                className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            >
                <span
                    className={`${theme === 'dark' ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                        } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                >
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                </span>
                <span
                    className={`${theme === 'dark' ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                        } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                >
                    <MoonIcon className="h-4 w-4 text-indigo-600" />
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;
