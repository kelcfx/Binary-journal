'use client';
import { useState } from "react";

export default function TradeLogs() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <>
            {/* Add New Trade Form - Always visible on Trade Logs page */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md mb-6`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Add New Trade</h2>
                <form onSubmit={handleAddTrade} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="asset" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Asset</label>
                        <input
                            type="text"
                            id="asset"
                            value={asset}
                            onChange={(e) => setAsset(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., EUR/USD, Gold"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="direction" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Direction</label>
                        <select
                            id="direction"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            required
                        >
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="entryPrice" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Entry Price</label>
                        <input
                            type="number"
                            step="0.00001"
                            id="entryPrice"
                            value={entryPrice}
                            onChange={(e) => setEntryPrice(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., 1.07890"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="expiryPrice" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Expiry Price</label>
                        <input
                            type="number"
                            step="0.00001"
                            id="expiryPrice"
                            value={expiryPrice}
                            onChange={(e) => setExpiryPrice(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., 1.07950"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="openTime" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Time of Opening</label>
                        <input
                            type="time"
                            id="openTime"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="expirationTime" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Time of Expiration</label>
                        <input
                            type="time"
                            id="expirationTime"
                            value={expirationTime}
                            onChange={(e) => setExpirationTime(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Amount Invested ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., 100.00"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="outcome" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Outcome</label>
                        <select
                            id="outcome"
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            required
                        >
                            <option value="Win">Win</option>
                            <option value="Loss">Loss</option>
                            <option value="Draw">Draw</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="profit" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Profit/Loss ($) (e.g., 80.00 for win, -100.00 for loss)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="profit"
                            value={profit}
                            onChange={(e) => setProfit(e.target.value)}
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="e.g., 80.00 or -100.00"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Notes (Optional)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                            placeholder="Add any relevant notes about the trade, strategy, etc."
                        ></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className={`px-5 py-2.5 ${isDarkMode ? 'bg-gray-300 text-gray-900' : 'bg-gray-600 text-white'} font-semibold rounded-full text-sm shadow-md hover:${isDarkMode ? 'bg-gray-400' : 'bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                        >
                            Add Trade
                        </button>
                    </div>
                </form>
            </div>

            {/* Trade History (Moved to Trade Logs page) */}
            <div className={`p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md mt-6`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Trade History</h2>
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={exportTradeHistory}
                        className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                    >
                        Export Trade History (CSV)
                    </button>
                </div>
                {trades.length === 0 ? (
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No trades recorded yet. Add your first trade above!</p>
                ) : (
                    <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner`}>
                        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <tr>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Date</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Asset</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Dir.</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Entry</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Expiry Price</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Open Time</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Expiry Time</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Amount</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Outcome</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>P/L ($)</th>
                                    <th className={`px-3 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                                {trades.map((trade) => (
                                    <tr key={trade.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {trade.timestamp?.toDate().toLocaleDateString()}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="text"
                                                    value={editTradeData.asset}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, asset: e.target.value })}
                                                    className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.asset
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <select
                                                    value={editTradeData.direction}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, direction: e.target.value })}
                                                    className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                >
                                                    <option value="Buy">Buy</option>
                                                    <option value="Sell">Sell</option>
                                                </select>
                                            ) : (
                                                trade.direction
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="number"
                                                    step="0.00001"
                                                    value={editTradeData.entryPrice}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, entryPrice: e.target.value })}
                                                    className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.entryPrice
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="number"
                                                    step="0.00001"
                                                    value={editTradeData.expiryPrice}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, expiryPrice: e.target.value })}
                                                    className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.expiryPrice
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="time"
                                                    value={editTradeData.openTime}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, openTime: e.target.value })}
                                                    className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.openTime || '-'
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="time"
                                                    value={editTradeData.expirationTime}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, expirationTime: e.target.value })}
                                                    className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.expirationTime || '-'
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editTradeData.amount}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, amount: e.target.value })}
                                                    className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                `$${trade.amount.toFixed(2)}`
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold`}>
                                            {editingTradeId === trade.id ? (
                                                <select
                                                    value={editTradeData.outcome}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, outcome: e.target.value })}
                                                    className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                >
                                                    <option value="Win">Win</option>
                                                    <option value="Loss">Loss</option>
                                                    <option value="Draw">Draw</option>
                                                </select>
                                            ) : (
                                                <span className={`${trade.outcome === 'Win' ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                                                    trade.outcome === 'Loss' ? (isDarkMode ? 'text-red-400' : 'text-red-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                                                    }`}>
                                                    {trade.outcome}
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold`}>
                                            {editingTradeId === trade.id ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editTradeData.profit}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, profit: e.target.value })}
                                                    className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                <span className={`${trade.profit >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                                    }`}>
                                                    ${trade.profit.toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <textarea
                                                    value={editTradeData.notes}
                                                    onChange={(e) => setEditTradeData({ ...editTradeData, notes: e.target.value })}
                                                    rows="1"
                                                    className={`w-32 p-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
                                                />
                                            ) : (
                                                trade.notes
                                            )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs flex space-x-1">
                                            {editingTradeId === trade.id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEditingTrade(trade.id)}
                                                        className={`text-green-500 hover:text-green-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                                                        title="Save Changes"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingTrade}
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
                                                        onClick={() => startEditingTrade(trade)}
                                                        className={`text-gray-500 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                                                        title="Edit Trade"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTrade(trade.id)}
                                                        className={`text-red-500 hover:text-red-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                                        title="Delete Trade"
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
        </>
    )
  }