'use client';
import { useState } from "react";

export default function ShowAddJournalModal() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-xl max-w-md w-full mx-4 relative`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Create New Journal</h2>
                <button
                    onClick={() => setShowAddJournalModal(false)}
                    className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors rounded-full p-1 shadow-sm`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="pt-4">
                    <label htmlFor="newJournalName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Journal Name</label>
                    <div className="flex">
                        <input
                            type="text"
                            id="newJournalName"
                            value={newJournalName}
                            onChange={(e) => setNewJournalName(e.target.value)}
                            className={`block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-l-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., My Forex Journal"
                        />
                        <button
                            onClick={() => handleCreateJournal()}
                            className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-300 text-gray-900' : 'bg-gray-600 text-white'} font-semibold rounded-r-xl text-sm shadow-md hover:${isDarkMode ? 'bg-gray-400' : 'bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}