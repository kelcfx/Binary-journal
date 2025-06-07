'use client';

import { formatYYYYMMDD, getDaysInMonth, weekdays } from "../utils/dateManipulation";

type MonthlySummary = {
    totalTrades: number;
    totalProfitLoss: number;
};

interface CalendarProps {
    isDarkMode: boolean,
    handlePrevMonth: () => void,
    handleNextMonth: () => void,
    currentMonth: Date,
    dailyStats: Record<string, { totalTrades: number; totalProfitLoss: number }>,
    weeklySummaries: Array<{ startDate: string; endDate: string; totalTrades: number; totalProfitLoss: number }>,
    monthlySummary: MonthlySummary,
    exportDailyCalendarData: () => void,
    exportWeeklyCalendarData: () => void,
    exportMonthlyCalendarData: () => void
}

export default function Calendar({
    isDarkMode,
    handlePrevMonth,
    handleNextMonth,
    currentMonth,
    dailyStats,
    weeklySummaries,
    monthlySummary,
    exportDailyCalendarData,
    exportWeeklyCalendarData,
    exportMonthlyCalendarData,
}: CalendarProps) {

    const daysInMonth = getDaysInMonth(currentMonth);
    
    return (
        <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Monthly Performance Calendar</h2>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className={`px-4 py-2 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                    &lt; Prev
                </button>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={handleNextMonth} className={`px-4 py-2 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                    Next &gt;
                </button>
            </div>

            <div className={`grid grid-cols-7 gap-1 text-center text-sm mb-2`}>
                {weekdays.map(day => (
                    <div key={day} className={`font-semibold ${isDarkMode ? 'text-gray-300 bg-gray-800 border-gray-700' : 'text-gray-700 bg-gray-100 border-gray-200'} py-2 rounded-xl border`}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, index) => {
                    const dateKey = day ? formatYYYYMMDD(day) : null;
                    const dayStatsData = dateKey && dailyStats[dateKey] ? dailyStats[dateKey] : { totalTrades: 0, totalProfitLoss: 0 };
                    const isProfitable = dayStatsData.totalProfitLoss > 0;
                    const isLoss = dayStatsData.totalProfitLoss < 0;

                    return (
                        <div
                            key={index}
                            className={`p-2 rounded-xl h-28 flex flex-col items-center justify-center text-center
                                ${day ? (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200') : (isDarkMode ? 'bg-gray-900 border-dashed border-gray-700' : 'bg-gray-100 border-dashed border-gray-300')}
                                ${isProfitable ? (isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200') : ''}
                                ${isLoss ? (isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200') : ''}
                                ${day ? 'shadow-sm' : ''}
                                transition-all duration-200 ease-in-out
                            `}
                        >
                            {day ? (
                                <>
                                    <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{day.getDate()}</span>
                                    {dayStatsData.totalTrades > 0 && (
                                        <>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{dayStatsData.totalTrades} trades</span>
                                            <span className={`text-sm font-semibold ${isProfitable ? (isDarkMode ? 'text-green-400' : 'text-green-600') : isLoss ? (isDarkMode ? 'text-red-400' : 'text-red-600') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                                                ${dayStatsData.totalProfitLoss.toFixed(2)}
                                            </span>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="h-full w-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Weekly Summaries */}
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Weekly Summaries</h3>
            <div className="space-y-2">
                {weeklySummaries.length > 0 ? (
                    weeklySummaries.map((week, index) => (
                        <div key={index} className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md flex justify-between items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} border`}>
                            <span>Week {week.startDate} to {week.endDate}: {week.totalTrades} trades</span>
                            <span className={`font-bold text-lg ${week.totalProfitLoss >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                                ${week.totalProfitLoss}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No weekly data for this month.</p>
                )}
            </div>

            {/* Monthly Summary */}
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Monthly Summary</h3>
            <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-xl shadow-md flex justify-between items-center text-lg font-bold border-2`}>
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Total for {currentMonth.toLocaleString('default', { month: 'long' })}: {monthlySummary.totalTrades} trades</span>
                <span className={`text-2xl ${monthlySummary.totalProfitLoss >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                    ${monthlySummary.totalProfitLoss}
                </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={exportDailyCalendarData} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                    Export Daily Data
                </button>
                <button onClick={exportWeeklyCalendarData} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                    Export Weekly Data
                </button>
                <button onClick={exportMonthlyCalendarData} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-xs hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}>
                    Export Monthly Summary
                </button>
            </div>
        </div>
    )
  }