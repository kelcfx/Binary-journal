'use client';
import { useState } from "react";

export default function JournalManagement() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
            <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md mt-6`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Manage Your Journals</h2>

                <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Your Journals</h3>
                    {journals.length === 0 ? (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No journals found. Create your first journal above!</p>
                    ) : (
                        <ul className="space-y-3">
                            {journals.map(journal => (
                                <li key={journal.id} className={`p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border`}>
                                    {editingJournalId === journal.id ? (
                                        <div className="flex-grow flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                value={editJournalName}
                                                onChange={(e) => setEditJournalName(e.target.value)}
                                                className={`flex-grow p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                            />
                                            <button
                                                onClick={() => saveEditingJournal(journal.id)}
                                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-300 text-gray-900' : 'bg-gray-600 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-400' : 'bg-gray-700'} transition-colors shadow-sm`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditingJournal}
                                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} transition-colors shadow-sm`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`font-semibold text-lg ${currentJournalId === journal.id ? (isDarkMode ? 'text-gray-400' : 'text-gray-600') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>
                                            {journal.name} {currentJournalId === journal.id && '(Active)'}
                                        </span>
                                    )}
                                    <div className="flex space-x-2">
                                        {editingJournalId !== journal.id && (
                                            <>
                                                <button
                                                    onClick={() => handleSelectJournal(journal.id, journal.name)}
                                                    disabled={currentJournalId === journal.id}
                                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors shadow-sm
                                                        ${currentJournalId === journal.id ? (isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : (isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600')}
                                                    `}
                                                >
                                                    Select
                                                </button>
                                                <button
                                                    onClick={() => startEditingJournal(journal)}
                                                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-400 text-gray-900'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                                                >
                                                    Edit Name
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteJournal(journal.id, journal.name)}
                                                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-red-700' : 'bg-red-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
    )
  }