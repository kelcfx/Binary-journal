'use client';


interface Goal {
    id: string | number;
    type: string;
    periodStart?: { toDate: () => Date };
    periodEnd?: { toDate: () => Date };
    goalAmount: number;
    actualProfit: number;
    achieved: boolean;
}

interface GoalHistoryProps {
    isDarkMode: boolean;
    exportGoalHistory: () => void;
    goalHistory: Goal[];
}

export default function GoalHistory({ isDarkMode, exportGoalHistory, goalHistory }: GoalHistoryProps) {

    return (
        <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md mt-6`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Goal History</h2>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={exportGoalHistory}
                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                >
                    Export Goal History (CSV)
                </button>
            </div>
            {goalHistory.length === 0 ? (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No goal history recorded yet. Set daily/weekly goals and trade to see them here!</p>
            ) : (
                <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <tr>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Type</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Period</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Goal ($)</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Actual P/L ($)</th>
                                <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Status</th>
                            </tr>
                        </thead>
                        <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                            {goalHistory.map((goal) => (
                                <tr key={goal.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {goal.periodStart?.toDate().toLocaleDateString()} - {goal.periodEnd?.toDate().toLocaleDateString()}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        ${goal.goalAmount.toFixed(2)}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold ${goal.actualProfit >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                        }`}>
                                        ${goal.actualProfit.toFixed(2)}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold ${goal.achieved ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                        }`}>
                                        {goal.achieved ? 'Achieved' : 'Not Achieved'}
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