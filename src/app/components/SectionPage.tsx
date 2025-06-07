'use client';
// import { useState } from "react";
import Dashboard from "./Dashboard";
import TradeLogs from "./TradeLogs";
import Statistics from "./Statistics";
import Transactions from "./Transactions";
import Calendar from "./Calender";
import GoalHistory from "./GoalHistory";
import JournalManagement from "./JournalManagement";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";

type Journal = {
    id: string;
    name: string;
};

interface Trade {
    id: string;
    asset: string;
    numberOfTrades: number;
    tradeDuration: string;
    direction: string;
    tradeStartTime: string;
    tradeStopTime: string;
    amount: number;
    outcome: string;
    profit: number;
    notes: string;
    timestamp?: { toDate: () => Date };
}

interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    note?: string;
    timestamp: { toDate: () => Date };
}

interface Goal {
    id: string | number;
    type: string;
    periodStart?: { toDate: () => Date };
    periodEnd?: { toDate: () => Date };
    goalAmount: number;
    actualProfit: number;
    achieved: boolean;
}

type MonthlySummary = {
    totalTrades: number;
    totalProfitLoss: number;
};

interface SectionPageProps {
    isDarkMode: boolean;
    currentPage: string | null;
    setCurrentPage: (page: string) => void;
    journals: Journal[];
    editingJournalId: string | null;
    editJournalName: string;
    setEditJournalName: (name: string) => void;
    currentJournalId: string | null;
    handleDeleteJournal: (id: string, name: string) => void;
    startEditingJournal: (journal: Journal) => void;
    cancelEditingJournal: () => void;
    saveEditingJournal: (id: string) => void;
    handleSelectJournal: (id: string, name: string) => void;
    setShowAddJournalModal: (show: boolean) => void;
    handleAddTrade: (e: React.FormEvent<HTMLFormElement>) => void,
    tradeDate: string,
    setTradeDate: (value: string) => void,
    asset: string,
    setAsset: (value: string) => void,
    numberOfTrades: string,
    setNumberOfTrades: (value: string) => void,
    tradeDuration: string,
    setTradeDuration: (value: string) => void,
    tradeStopTime: string,
    setTradeStopTime: (value: string) => void,
    tradeStartTime: string,
    setTradeStartTime: (value: string) => void,
    outcome: string,
    setOutcome: (value: string) => void,
    direction: string,
    setDirection: (value: string) => void,
    amount: string,
    setAmount: (value: string) => void,
    profit: string,
    setProfit: (value: string) => void,
    notes: string,
    setNotes: (value: string) => void,
    exportTradeHistory: () => void,
    trades: Trade[];
    editingTradeId: string | null;
    editTradeData: {
        date: string;
        asset: string;
        numberOfTrades: string | number;
        tradeDuration: string;
        direction: string;
        tradeStartTime: string;
        tradeStopTime: string;
        amount: string | number;
        outcome: string;
        profit: string | number;
        notes: string;
    };
    setEditTradeData: (data: {
        date: string;
        asset: string;
        numberOfTrades: string | number;
        tradeDuration: string;
        direction: string;
        tradeStartTime: string;
        tradeStopTime: string;
        amount: string | number;
        outcome: string;
        profit: string | number;
        notes: string;
    }) => void;
    saveEditingTrade: (id: string) => void;
    handleDeleteTrade: (id: string) => void;
    startEditingTrade: (trade: Trade) => void;
    cancelEditingTrade: () => void;
    currentBalance: number;
    stats: {
        totalProfitLoss: number;
        winRate: number;
        totalTrades: number;
        averageProfitPerWin: number;
        averageLossPerLoss: number;
        profitFactor: number;
    };
    cumulativeProfitLossChartData: Array<{ date: string;['Cumulative Profit']: number }>;
    dailyProfitExpectation: number;
    weeklyProfitExpectation: number;
    currentDayProfit: number;
    currentWeekProfit: number;
    dailyProgress: number;
    weeklyProgress: number;
    amountToRisk: string;
    setShowDailyProfitExpectationModal: (show: boolean) => void;
    setShowWeeklyProfitExpectationModal: (show: boolean) => void;
    setShowCapitalManagementModal: (show: boolean) => void;
    handleGetTradingInsights: () => void;
    llmLoading: boolean;
    dailyProfitLossBarChartData: Array<{ date: string; profit: number }>;
    winRateByAssetData: { name: string; wins: number; total: number }[];
    winRateByDirectionData: { name: string; wins: number; total: number }[];
    profitLossDistributionData: Array<{ range: string; count: number }>;
    tradeCountByDayOfWeekData: { name: string; count: number }[];
    tradeCountByHourOfDayData: { name: string; count: number }[];
    exportOverallStats: () => void;
    exportDailyCalendarData: () => void;
    exportWinRateByAsset: () => void;
    exportWinRateByDirection: () => void;
    exportProfitLossDistribution: () => void;
    exportTradeCountByDayOfWeek: () => void;
    exportTradeCountByHourOfDay: () => void;
    averageProfitLossData: { name: string; value: number }[];
    exportAverageProfitLoss: () => void;
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
    setEditTransactionNote: (value: string) => void,
    handlePrevMonth: () => void,
    handleNextMonth: () => void,
    currentMonth: Date,
    dailyStats: Record<string, { totalTrades: number; totalProfitLoss: number }>,
    weeklySummaries: Array<{ startDate: string; endDate: string; totalTrades: number; totalProfitLoss: number }>,
    monthlySummary: MonthlySummary,
    exportWeeklyCalendarData: () => void,
    exportMonthlyCalendarData: () => void,
    exportGoalHistory: () => void,
    goalHistory: Goal[],
}

export default function SectionPage({ 
    isDarkMode,
    journals,
    currentPage,
    setCurrentPage,
    editingJournalId,
    editJournalName,
    setEditJournalName,
    currentJournalId,
    handleDeleteJournal,
    startEditingJournal,
    cancelEditingJournal,
    saveEditingJournal,
    handleSelectJournal,
    setShowAddJournalModal,
    handleAddTrade,
    tradeDate,
    setTradeDate,
    asset,
    setAsset,
    numberOfTrades,
    setNumberOfTrades,
    tradeDuration,
    setTradeDuration,
    tradeStopTime,
    setTradeStopTime,
    tradeStartTime,
    setTradeStartTime,
    outcome,
    setOutcome,
    direction,
    setDirection,
    amount,
    setAmount,
    profit,
    setProfit,
    notes,
    setNotes,
    exportTradeHistory,
    trades,
    editingTradeId,
    editTradeData,
    setEditTradeData,
    saveEditingTrade,
    handleDeleteTrade,
    startEditingTrade,
    cancelEditingTrade,
    currentBalance,
    stats,
    cumulativeProfitLossChartData,
    weeklyProfitExpectation,
    currentDayProfit,
    currentWeekProfit,
    dailyProgress,
    weeklyProgress,
    amountToRisk,
    setShowDailyProfitExpectationModal,
    setShowWeeklyProfitExpectationModal,
    setShowCapitalManagementModal,
    handleGetTradingInsights,
    llmLoading,
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
    exportAverageProfitLoss,
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
    setEditTransactionNote,
    handlePrevMonth,
    handleNextMonth,
    currentMonth,
    dailyStats,
    weeklySummaries,
    monthlySummary,
    exportWeeklyCalendarData,
    exportMonthlyCalendarData,
    exportGoalHistory,
    goalHistory,
}: SectionPageProps) {
    const { user, logOut } = useAuth();
    const userName = user?.displayName;
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className={`max-w-6xl mx-auto rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 md:p-8`}>
            <h1 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Binary Options Trading Journal
            </h1>
        
            {/* User ID Display */}
            <div className={`mb-6 p-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'} rounded-xl text-sm break-words shadow-inner`}>
                <div>
                    Welcome: <span className={`font-mono font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userName}</span>
                </div>
                <button
                    onClick={logOut}
                    className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'} rounded-full text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                >
                    Sign out
                </button>
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
                    className={`p-4 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`}
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
            {/* Dashboard page */}
            {currentPage === 'Dashboard' && (
                <Dashboard
                    isDarkMode={isDarkMode}
                    currentBalance={currentBalance}
                    stats={stats}
                    cumulativeProfitLossChartData={cumulativeProfitLossChartData}
                    dailyProfitExpectation={dailyProfitExpectation}
                    weeklyProfitExpectation={weeklyProfitExpectation}
                    currentDayProfit= {currentDayProfit}
                    currentWeekProfit={currentWeekProfit}
                    dailyProgress= {dailyProgress}
                    weeklyProgress= {weeklyProgress}
                    amountToRisk= {amountToRisk}
                    setShowDailyProfitExpectationModal= {setShowDailyProfitExpectationModal}
                    setShowWeeklyProfitExpectationModal= {setShowWeeklyProfitExpectationModal}
                    setShowCapitalManagementModal= {setShowCapitalManagementModal}
                    handleGetTradingInsights={handleGetTradingInsights}
                    llmLoading= {llmLoading}
                />
            )}

            {/* TradeLogs */}
            {currentPage === 'TradeLogs' && (
                <TradeLogs
                    isDarkMode={isDarkMode}
                    handleAddTrade={handleAddTrade}
                    tradeDate={tradeDate}
                    setTradeDate={setTradeDate}
                    asset={asset}
                    setAsset={setAsset}
                    numberOfTrades={numberOfTrades}
                    setNumberOfTrades={setNumberOfTrades}
                    tradeDuration={tradeDuration}
                    setTradeDuration={setTradeDuration}
                    tradeStopTime={tradeStopTime}
                    setTradeStopTime={setTradeStopTime}
                    tradeStartTime={tradeStartTime}
                    setTradeStartTime={setTradeStartTime}
                    outcome={outcome}
                    setOutcome={setOutcome}
                    direction={direction}
                    setDirection={setDirection}
                    amount={amount}
                    setAmount={setAmount}
                    profit={profit}
                    setProfit={setProfit}
                    notes={notes}
                    setNotes={setNotes}
                    exportTradeHistory={exportTradeHistory}
                    trades={trades}
                    editingTradeId={editingTradeId}
                    editTradeData={editTradeData}
                    setEditTradeData={setEditTradeData}
                    saveEditingTrade={saveEditingTrade}
                    handleDeleteTrade={handleDeleteTrade}
                    startEditingTrade={startEditingTrade}
                    cancelEditingTrade={cancelEditingTrade}
                />
            )}

            {/* Statistics Page */}
            {currentPage === 'Statistics' && (
                <Statistics
                    isDarkMode={isDarkMode}
                    cumulativeProfitLossChartData={cumulativeProfitLossChartData}
                    dailyProfitLossBarChartData={dailyProfitLossBarChartData}
                    dailyProfitExpectation={dailyProfitExpectation}
                    winRateByAssetData={winRateByAssetData}
                    winRateByDirectionData={winRateByDirectionData}
                    profitLossDistributionData={profitLossDistributionData}
                    tradeCountByDayOfWeekData={tradeCountByDayOfWeekData}
                    tradeCountByHourOfDayData={tradeCountByHourOfDayData}
                    exportOverallStats={exportOverallStats}
                    exportDailyCalendarData={exportDailyCalendarData}
                    exportWinRateByAsset={exportWinRateByAsset}
                    exportWinRateByDirection={exportWinRateByDirection}
                    exportProfitLossDistribution={exportProfitLossDistribution}
                    exportTradeCountByDayOfWeek={exportTradeCountByDayOfWeek}
                    exportTradeCountByHourOfDay={exportTradeCountByHourOfDay}
                    averageProfitLossData={averageProfitLossData}
                    exportAverageProfitLoss={exportAverageProfitLoss}
                />
            )}

            {/* Transactions page */}
            {currentPage === 'Transactions' && (
                <Transactions
                    isDarkMode={isDarkMode}
                    exportTransactions={exportTransactions}
                    transactions={transactions}
                    deleteTransaction={deleteTransaction}
                    startEditingTransaction={startEditingTransaction}
                    cancelEditingTransaction={cancelEditingTransaction}
                    saveEditingTransaction={saveEditingTransaction}
                    editingTransactionId={editingTransactionId}
                    editTransactionAmount={editTransactionAmount}
                    setEditTransactionAmount={setEditTransactionAmount}
                    editTransactionNote={editTransactionNote}
                    setEditTransactionNote={setEditTransactionNote}
                />
            )}

            {/* Calendar page */}
            {currentPage === 'Calendar' && (
                <Calendar
                    isDarkMode={isDarkMode}
                    handlePrevMonth={handlePrevMonth}
                    handleNextMonth={handleNextMonth}
                    currentMonth={currentMonth}
                    dailyStats={dailyStats}
                    weeklySummaries={weeklySummaries}
                    monthlySummary={monthlySummary}
                    exportDailyCalendarData={exportDailyCalendarData}
                    exportWeeklyCalendarData={exportWeeklyCalendarData}
                    exportMonthlyCalendarData={exportMonthlyCalendarData}
                />
            )}

              {/* Goal history page */}
            {currentPage === 'GoalHistory' && (
                <GoalHistory
                    isDarkMode={isDarkMode}
                    exportGoalHistory={exportGoalHistory}
                    goalHistory={goalHistory}
                />
            )}

            {/* Trade Journal Management Page */}
            {currentPage === 'JournalManagement' && (
                <JournalManagement
                    isDarkMode={isDarkMode}
                    journals={journals}
                    currentJournalId={currentJournalId}
                    handleSelectJournal={handleSelectJournal}
                    editingJournalId={editingJournalId}
                    editJournalName={editJournalName}
                    setEditJournalName={setEditJournalName}
                    handleDeleteJournal={handleDeleteJournal}
                    startEditingJournal={startEditingJournal}
                    cancelEditingJournal={cancelEditingJournal}
                    saveEditingJournal={saveEditingJournal}
                />
            )}
        </div>
    )
  }