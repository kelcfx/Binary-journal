'use client';
import { useEffect, useState } from "react";

export default function Main() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // const toggleTheme = () => {
    //     setIsDarkMode(prevMode => !prevMode);
    // };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} p-4 font-inter`}>
            <h1>Hello Kelz</h1>
        </div>   
    )
  }