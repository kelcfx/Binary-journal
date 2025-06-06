'use client';

import { useState } from "react";

interface ShowCapitalManagementModalProps {
    isDarkMode: boolean;
    setShowCapitalManagementModal: (show: boolean) => void;
    
}
//     depositAmount
// setDepositAmount 
// withdrawAmount 
// setWithdrawAmount 
// handleDeposit 
// }

export default function ShowCapitalManagementModal({ isDarkMode, setShowCapitalManagementModal, depositAmount, setDepositAmount, withdrawAmount, setWithdrawAmount, handleDeposit   }: ShowCapitalManagementModalProps) {
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-xl max-w-md w-full mx-4 relative`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Capital Management</h2>
                <button
                    onClick={() => setShowCapitalManagementModal(false)}
                    className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors rounded-full p-1 shadow-sm`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                        <label htmlFor="depositAmount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Deposit Funds ($)</label>
                        <div className="flex">
                            <input
                                type="number"
                                step="0.01"
                                id="depositAmount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className={`block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-l-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                placeholder="e.g., 500.00"
                            />
                            <button
                                onClick={handleDeposit}
                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-300 text-gray-900' : 'bg-gray-600 text-white'} font-semibold rounded-r-xl text-sm shadow-md hover:${isDarkMode ? 'bg-gray-400' : 'bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                            >
                                Deposit
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="withdrawAmount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Withdraw Funds ($)</label>
                        <div className="flex">
                            <input
                                type="number"
                                step="0.01"
                                id="withdrawAmount"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className={`block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-l-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                placeholder="e.g., 100.00"
                            />
                            <button
                                onClick={handleWithdraw}
                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} font-semibold rounded-r-xl text-sm shadow-md hover:${isDarkMode ? 'bg-red-700' : 'bg-red-600'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`}
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>
                    <div className="col-span-full flex justify-end mt-4">
                        <button
                            onClick={handleResetJournal}
                            className={`px-4 py-2 ${isDarkMode ? 'bg-red-700 text-white' : 'bg-red-600 text-white'} font-semibold rounded-full text-sm shadow-md hover:${isDarkMode ? 'bg-red-800' : 'bg-red-700'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`}
                        >
                            Reset Current Journal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}