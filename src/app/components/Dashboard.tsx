'use client';
import { useState } from "react";

export default function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Balance Box - Moved to Dashboard */}
            <div className={`lg:col-span-2 mb-6 p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} rounded-xl shadow-xl text-center transition-all duration-300 ease-in-out`}>
                <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Current Trading Balance:</p>
                <p className={`text-5xl font-extrabold ${currentBalance >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                    ${currentBalance.toFixed(2)}
                </p>
                {/* Mini PnL Growth Chart */}
                {cumulativeProfitLossChartData.length > 0 ? (
                    <div className="mt-4 h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cumulativeProfitLossChartData}>
                                <Line
                                    type="monotone"
                                    dataKey="Cumulative Profit"
                                    stroke={stats.totalProfitLoss >= 0 ? (isDarkMode ? '#4ADE80' : '#22C55E') : (isDarkMode ? '#F87171' : '#EF4444')}
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <XAxis dataKey="date" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Profit/Loss']}
                                    labelFormatter={(label) => `Date: ${label}`}
                                    contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }}
                                    labelStyle={{ color: isDarkMode ? 'white' : 'black' }}
                                    itemStyle={{ color: isDarkMode ? 'white' : 'black' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-4`}>Record trades to see PnL growth.</p>
                )}
            </div>

            {/* Amount to Risk Card */}
            <div className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm text-center transition-all duration-200 ease-in-out hover:scale-105`}>
                <h3 className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount to Risk (20% of Balance)</h3>
                <p className={`mb-1 text-lg font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ${amountToRisk}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0`}>
                    This is 20% of your current balance for risk management.
                </p>
            </div>

            {/* Daily Profit Expectation as a clickable progress bar */}
            <div
                onClick={() => setShowDailyProfitExpectationModal(true)}
                className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm text-center cursor-pointer transition-all duration-200 ease-in-out hover:scale-105`}
            >
                <h3 className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Daily Profit Goal</h3>
                <p className={`mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Goal: <span className="font-bold">${dailyProfitExpectation.toFixed(2)}</span>
                </p>
                <p className={`mb-1 text-lg font-bold ${currentDayProfit >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                    Today's P/L: ${currentDayProfit.toFixed(2)}
                </p>
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-2 overflow-hidden`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getMeterColor(dailyProgress, currentDayProfit)}`}
                        style={{ width: `${Math.min(100, Math.max(0, dailyProgress))}%` }}
                    ></div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0`}>
                    {dailyProfitExpectation > 0 ?
                        `${Math.round(dailyProgress)}% of daily goal achieved` :
                        `Set a daily goal to track progress.`
                    }
                </p>
            </div>

            {/* Weekly Profit Expectation as a clickable progress bar */}
            <div
                onClick={() => setShowWeeklyProfitExpectationModal(true)}
                className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm text-center cursor-pointer transition-all duration-200 ease-in-out hover:scale-105`}
            >
                <h3 className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Weekly Profit Goal</h3>
                <p className={`mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Goal: <span className="font-bold">${weeklyProfitExpectation.toFixed(2)}</span>
                </p>
                <p className={`mb-1 text-lg font-bold ${currentWeekProfit >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                    This Week's P/L: ${currentWeekProfit.toFixed(2)}
                </p>
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-2 overflow-hidden`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getMeterColor(weeklyProgress, currentWeekProfit)}`}
                        style={{ width: `${Math.min(100, Math.max(0, weeklyProgress))}%` }}
                    ></div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0`}>
                    {weeklyProfitExpectation > 0 ?
                        `${Math.round(weeklyProgress)}% of weekly goal achieved` :
                        `Set a weekly goal to track progress.`
                    }
                </p>
            </div>

            {/* Capital Management Button (now opens modal) */}
            <div className={`lg:col-span-2 p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md text-center`}>
                <button
                    onClick={() => setShowCapitalManagementModal(true)}
                    className={`px-5 py-2.5 rounded-full shadow-md font-semibold text-sm transition-colors ${isDarkMode ? 'bg-gray-300 text-gray-900 hover:bg-gray-400' : 'bg-gray-600 text-white hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                >
                    Open Capital Management
                </button>
            </div>

            {/* Trading Statistics */}
            <div className={`lg:col-span-2 p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Trading Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                    {/* Net Profit/Loss */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">💰</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Net P/L</p>
                        <p className={`text-lg font-extrabold ${currentBalance >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                            ${stats.totalProfitLoss}
                        </p>
                    </div>

                    {/* Win Rate */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">📈</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Win Rate</p>
                        <p className={`text-lg font-extrabold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stats.winRate}%
                        </p>
                    </div>

                    {/* Total Trades */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">📊</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Total Trades</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stats.totalTrades}
                        </p>
                    </div>

                    {/* Average Profit per Win */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">⬆️</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Avg. Profit/Win</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            ${stats.averageProfitPerWin}
                        </p>
                    </div>

                    {/* Average Loss per Loss */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">⬇️</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Avg. Loss/Loss</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                            ${stats.averageLossPerLoss}
                        </p>
                    </div>

                    {/* Profit Factor */}
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1 text-sm`}>
                        <span className="text-3xl">📈</span>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>Profit Factor</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stats.profitFactor}
                        </p>
                    </div>
                </div>
                {/* New LLM Insight Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleGetTradingInsights}
                        disabled={llmLoading}
                        className={`px-5 py-2.5 rounded-full shadow-md font-semibold text-sm transition-colors
                            ${llmLoading ? (isDarkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : (isDarkMode ? 'bg-gray-300 text-gray-900 hover:bg-gray-400' : 'bg-gray-600 text-white hover:bg-gray-700')}
                        `}
                    >
                        {llmLoading ? 'Getting Insights...' : 'Get Trade Insights ✨'}
                    </button>
                </div>
            </div>
        </div>
    )
  }