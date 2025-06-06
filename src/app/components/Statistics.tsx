'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { PIE_COLORS } from '../utils/meterColor';

type StatisticsProps = {
    isDarkMode: boolean;
    cumulativeProfitLossChartData: any[];
    dailyProfitLossBarChartData: any[];
    dailyProfitExpectation: number;
    winRateByAssetData: any[];
    winRateByDirectionData: any[];
    profitLossDistributionData: any[];
    tradeCountByDayOfWeekData: any[];
    tradeCountByHourOfDayData: any[];
    exportOverallStats: () => void;
    exportDailyCalendarData: () => void;
    exportWinRateByAsset: () => void;
    exportWinRateByDirection: () => void;
    exportProfitLossDistribution: () => void;
    exportTradeCountByDayOfWeek: () => void;
    exportTradeCountByHourOfDay: () => void;
    averageProfitLossData: any[];
    exportAverageProfitLoss: () => void;
};

export default function Statistics({
    isDarkMode,
    cumulativeProfitLossChartData,
    dailyProfitLossBarChartData,
    dailyProfitExpectation,
    winRateByAssetData,
    winRateByDirectionData,
    profitLossDistributionData,
    tradeCountByDayOfWeekData,
    tradeCountByHourOfDayData,
    exportOverallStats,
    exportDailyCalendarData,
    exportWinRateByAsset,
    exportWinRateByDirection,
    exportProfitLossDistribution,
    exportTradeCountByDayOfWeek,
    exportTradeCountByHourOfDay,
    averageProfitLossData,
    exportAverageProfitLoss
}: StatisticsProps) {
    
    return (
        <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Performance Charts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cumulative Profit/Loss Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Cumulative Profit/Loss</h3>
                    {cumulativeProfitLossChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={cumulativeProfitLossChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="date" stroke={isDarkMode ? '#ccc' : '#666'} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Profit/Loss']} labelFormatter={(label) => `Date: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Line type="monotone" dataKey="Cumulative Profit" stroke={isDarkMode ? '#4ADE80' : '#22C55E'} strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No trading data available.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportOverallStats} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export Overall Stats
                        </button>
                    </div>
                </div>

                {/* Daily Profit/Loss Bar Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Daily Profit/Loss</h3>
                    {dailyProfitLossBarChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={dailyProfitLossBarChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="date" stroke={isDarkMode ? '#ccc' : '#666'} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Profit/Loss']} labelFormatter={(label) => `Date: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Bar dataKey="profit">
                                    {dailyProfitLossBarChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? (isDarkMode ? '#4ADE80' : '#22C55E') : (isDarkMode ? '#F87171' : '#EF4444')} />
                                    ))}
                                </Bar>
                                {dailyProfitExpectation !== 0 && (
                                    <ReferenceLine y={dailyProfitExpectation} stroke={isDarkMode ? '#D1D5DB' : '#A0AEC0'} strokeDasharray="3 3" label={{ value: `Goal: $${dailyProfitExpectation.toFixed(2)}`, position: 'top', fill: isDarkMode ? '#D1D5DB' : '#A0AEC0', fontSize: 12 }} />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No daily profit/loss data.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportDailyCalendarData} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export Daily P/L
                        </button>
                    </div>
                </div>

                {/* Win Rate by Asset Pie Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Win Rate by Asset</h3>
                    {winRateByAssetData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={winRateByAssetData.map(data => ({ name: data.name, value: data.wins, total: data.total }))}
                                    cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value"
                                >
                                    {winRateByAssetData.map((entry, index) => (
                                        <Cell key={`cell-asset-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} wins`, name]} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Legend align="center" verticalAlign="bottom" layout="horizontal" wrapperStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No asset data available.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportWinRateByAsset} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export by Asset
                        </button>
                    </div>
                </div>

                {/* Win Rate by Direction Pie Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Win Rate by Direction</h3>
                    {winRateByDirectionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={winRateByDirectionData.map(data => ({ name: data.name, value: data.wins, total: data.total }))}
                                    cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value"
                                >
                                    {winRateByDirectionData.map((entry, index) => (
                                        <Cell key={`cell-direction-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} wins`, name]} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Legend align="center" verticalAlign="bottom" layout="horizontal" wrapperStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No direction data available.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportWinRateByDirection} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export by Direction
                        </button>
                    </div>
                </div>

                {/* Profit/Loss Distribution Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>P/L Distribution</h3>
                    {profitLossDistributionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={profitLossDistributionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="range" stroke={isDarkMode ? '#ccc' : '#666'} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`${value} trades`, 'Count']} labelFormatter={(label) => `Range: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Bar dataKey="count" fill={isDarkMode ? '#9CA3AF' : '#6B7280'} /> {/* Gray shades */}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No P/L distribution data.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportProfitLossDistribution} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export P/L Distribution
                        </button>
                    </div>
                </div>

                {/* Trade Count by Day of Week Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Trades by Day</h3>
                    {tradeCountByDayOfWeekData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={tradeCountByDayOfWeekData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#666'} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`${value} trades`, 'Count']} labelFormatter={(label) => `Day: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Bar dataKey="count" fill={isDarkMode ? '#9CA3AF' : '#6B7280'} /> {/* Gray shades */}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No daily trade count data.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportTradeCountByDayOfWeek} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export by Day
                        </button>
                    </div>
                </div>

                {/* Trade Count by Hour of Day Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Trades by Hour</h3>
                    {tradeCountByHourOfDayData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={tradeCountByHourOfDayData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#666'} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`${value} trades`, 'Count']} labelFormatter={(label) => `Hour: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Bar dataKey="count" fill={isDarkMode ? '#9CA3AF' : '#6B7280'} /> {/* Gray shades */}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No hourly trade count data.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportTradeCountByHourOfDay} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export by Hour
                        </button>
                    </div>
                </div>

                {/* Average Profit/Loss per Trade Chart */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-sm flex flex-col items-center`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center`}>Avg. P/L per Trade</h3>
                    {averageProfitLossData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={averageProfitLossData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#ccc'} />
                                <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#666'} />
                                <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
                                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} labelFormatter={(label) => `Metric: ${label}`} contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`, borderRadius: '8px', padding: '10px', fontSize: '12px', color: isDarkMode ? 'white' : 'black' }} labelStyle={{ color: isDarkMode ? 'white' : 'black' }} itemStyle={{ color: isDarkMode ? 'white' : 'black' }} />
                                <Bar dataKey="value">
                                    {averageProfitLossData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Average Win' ? (isDarkMode ? '#4ADE80' : '#22C55E') : (isDarkMode ? '#F87171' : '#EF4444')} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No average P/L data.</p>
                    )}
                    <div className="mt-2 text-center">
                        <button onClick={exportAverageProfitLoss} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                            Export Avg. P/L
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
  }