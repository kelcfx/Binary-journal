'use client';
import { useState } from "react";
import Dashboard from "./Dashboard";
import TradeLogs from "./TradeLogs";
import Statistics from "./Statistics";
import Transactions from "./Transactions";
import Calendar from "./Calender";
import GoalHistory from "./GoalHistory";
import JournalManagement from "./JournalManagement";
import { useAuth } from "../context/AuthContext";

interface SectionPageProps {
    isDarkMode: boolean;
    toggleTheme: boolean;
}

export default function SectionPage({ isDarkMode, toggleTheme }: SectionPageProps) {
    const { user } = useAuth();
    const userName = user?.displayName;

    return (
        <div className={`max-w-4xl mx-auto rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 md:p-8`}>
            <h1 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Binary Options Trading Journal
            </h1>
        
            {/* User ID Display */}
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'} rounded-xl text-sm break-words shadow-inner`}>
                Welcome: <span className={`font-mono font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userName}</span>
            </div>
        
            {/* Current Journal Display and Selector */}
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'} rounded-xl text-sm break-words shadow-inner flex items-center justify-between flex-wrap gap-2`}>
                <span className="font-semibold">Current Journal:</span>
                <select
                    value={currentJournalId || ''}
                    onChange={(e) => {
                        const selectedJournal = journals.find(j => j.id === e.target.value);
                        if (selectedJournal) {
                            handleSelectJournal(selectedJournal.id, selectedJournal.name);
                        }
                    }}
                    className={`p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`}
                >
                    {journals.length === 0 ? (
                        <option value="">No Journals</option>
                    ) : (
                        journals.map(journal => (
                            <option key={journal.id} value={journal.id}>
                                {journal.name}
                            </option>
                        ))
                    )}
                </select>
                <button
                    onClick={() => setShowAddJournalModal(true)}
                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                >
                    Add New Journal
                </button>
            </div>


            {/* Theme Toggle Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={toggleTheme}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-xl transition-colors shadow-md ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mb-6 gap-2 md:gap-4 flex-wrap">
                <button
                    onClick={() => setCurrentPage('Dashboard')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'Dashboard' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentPage('TradeLogs')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'TradeLogs' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Trade Logs
                </button>
                <button
                    onClick={() => setCurrentPage('Statistics')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'Statistics' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Statistics
                </button>
                <button
                    onClick={() => setCurrentPage('Transactions')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'Transactions' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Transactions
                </button>
                <button
                    onClick={() => setCurrentPage('Calendar')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'Calendar' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Calendar
                </button>
                <button
                    onClick={() => setCurrentPage('GoalHistory')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'GoalHistory' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Goal History
                </button>
                <button
                    onClick={() => setCurrentPage('JournalManagement')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out shadow-sm
                        ${currentPage === 'JournalManagement' ? (isDarkMode ? 'bg-gray-200 text-gray-900 shadow-lg transform scale-105' : 'bg-gray-700 text-white shadow-lg transform scale-105') : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `}
                >
                    Manage Journals
                </button>
            </div>
        
            {/* Conditional Rendering of Pages */}
            {currentPage === 'Dashboard' && (
                <Dashboard />
            )}

            {currentPage === 'TradeLogs' && (
                <TradeLogs />
            )}

            {currentPage === 'Statistics' && (
                <Statistics />
            )}

            {currentPage === 'Transactions' && (
                <Transactions />
            )}

            {currentPage === 'Calendar' && (
                <Calendar />
            )}

            {currentPage === 'GoalHistory' && (
                <GoalHistory />
            )}

            {currentPage === 'JournalManagement' && (
                <JournalManagement />
            )}
        </div>
    )
  }