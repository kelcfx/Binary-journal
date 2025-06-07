'use client';

// Define the Transaction interface if not already defined or import it from your models/types
interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    note?: string;
    timestamp: { toDate: () => Date };
}

interface TransactionsProps {
    isDarkMode: boolean,
    exportTransactions: () => void,
    transactions: Transaction[],
    deleteTransaction: (id: string) => void,
    startEditingTransaction: (transaction: Transaction) => void,
    cancelEditingTransaction: () => void,
    saveEditingTransaction: (id: string) => void,
    editingTransactionId: string | null,
    editTransactionAmount: string,
    setEditTransactionAmount: (value: string) => void,
    editTransactionNote: string,
    setEditTransactionNote: (value: string) => void
}

export default function Transactions({
    isDarkMode,
    exportTransactions,
    transactions,
    deleteTransaction,
    startEditingTransaction,
    cancelEditingTransaction,
    saveEditingTransaction,
    editingTransactionId,
    editTransactionAmount,
    setEditTransactionAmount,
    editTransactionNote,
    setEditTransactionNote
}: TransactionsProps) {
    
    return (
        <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md mt-6`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Transaction History (Deposits & Withdrawals)</h2>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={exportTransactions}
                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                >
                    Export Transactions (CSV)
                </button>
            </div>
            {transactions.length === 0 ? (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No transactions recorded yet. Make a deposit or withdrawal!</p>
            ) : (
                <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <tr>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Date</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Type</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Amount ($)</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Notes</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {transaction.timestamp?.toDate().toLocaleDateString()}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold ${transaction.type === 'deposit' ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                        }`}>
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {editingTransactionId === transaction.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editTransactionAmount}
                                                onChange={(e) => setEditTransactionAmount(e.target.value)}
                                                className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                            />
                                        ) : (
                                            `$${transaction.amount.toFixed(2)}`
                                        )}
                                    </td>
                                    <td className={`px-3 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {editingTransactionId === transaction.id ? (
                                            <input
                                                type="text"
                                                value={editTransactionNote}
                                                onChange={(e) => setEditTransactionNote(e.target.value)}
                                                className={`w-32 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                            />
                                        ) : (
                                            transaction.note || '-'
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs flex space-x-1">
                                        {editingTransactionId === transaction.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEditingTransaction(transaction.id)}
                                                    className={`text-green-500 hover:text-green-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                                                    title="Save Changes"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={cancelEditingTransaction}
                                                    className={`text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                                                    title="Cancel Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditingTransaction(transaction)}
                                                    className={`text-gray-500 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                                                    title="Edit Transaction"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteTransaction(transaction.id)}
                                                    className={`text-red-500 hover:text-red-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                                    title="Delete Transaction"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
  }