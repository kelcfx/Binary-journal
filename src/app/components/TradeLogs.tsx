'use client';


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


interface TradeLogsProps {
    isDarkMode: boolean,
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
}

export default function TradeLogs({
    isDarkMode,
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
    }: TradeLogsProps) {

    return (
        <>
            <div className={`p-6 border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} rounded-xl shadow-md mb-6`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Add New Trade Session</h2>
                <form onSubmit={handleAddTrade} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tradeDate" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date of Session</label>
                        <input type="date" id="tradeDate" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} required />
                    </div>
                    <div>
                        <label htmlFor="asset" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Asset</label>
                        <input type="text" id="asset" value={asset} onChange={(e) => setAsset(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="e.g., EUR/USD" required />
                    </div>
                    <div>
                        <label htmlFor="numberOfTrades" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Number of Trades in Session</label>
                        <input type="number" id="numberOfTrades" value={numberOfTrades} onChange={(e) => setNumberOfTrades(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="e.g., 5" required />
                    </div>
                    <div>
                        <label htmlFor="tradeDuration" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Trade Duration (each)</label>
                        <input type="text" id="tradeDuration" value={tradeDuration} onChange={(e) => setTradeDuration(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="e.g., 1m, 5m, 15m" required />
                    </div>
                    <div>
                        <label htmlFor="tradeStartTime" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Session Start Time</label>
                        <input type="time" id="tradeStartTime" value={tradeStartTime} onChange={(e) => setTradeStartTime(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} required />
                    </div>
                    <div>
                        <label htmlFor="tradeStopTime" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Session Stop Time</label>
                        <input type="time" id="tradeStopTime" value={tradeStopTime} onChange={(e) => setTradeStopTime(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} required />
                    </div>
                    <div>
                        <label htmlFor="direction" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Overall Direction</label>
                        <select id="direction" value={direction} onChange={(e) => setDirection(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} required>
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="outcome" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Overall Session Outcome</label>
                        <select id="outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} required>
                            <option value="Win">Win</option>
                            <option value="Loss">Loss</option>
                            <option value="Draw">Draw</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Total Amount Invested (Session)</label>
                        <input type="number" step="0.01" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="e.g., 100.00" required />
                    </div>
                    <div>
                        <label htmlFor="profit" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Total Profit/Loss (Session)</label>
                        <input type="number" step="0.01" id="profit" value={profit} onChange={(e) => setProfit(e.target.value)} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="e.g., 80.00 or -100.00" required />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Notes (Optional)</label>
                        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`mt-1 block w-full p-2 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-gray-500 focus:border-gray-500`} placeholder="Session strategy, market conditions, emotions..."></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className={`px-5 py-2.5 ${isDarkMode ? 'bg-gray-300 text-gray-900 hover:bg-gray-400' : 'bg-gray-600 text-white hover:bg-gray-700'} font-semibold rounded-full text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500`}>Add Trade Session</button>
                    </div>
                </form>
            </div>

            <div className={`p-6 border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} rounded-xl shadow-md mt-6`}>
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Trade Session History</h2>
                <div className="mb-4 flex justify-end">
                    <button onClick={exportTradeHistory} className={`px-3 py-1.5 ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'} rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`}>Export History (CSV)</button>
                </div>
                {trades.length === 0 ? (
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No trade sessions recorded yet.</p>
                ) : (
                    <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner`}>
                        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <tr>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Date</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Asset</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>No. Trades</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Duration</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Dir.</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Session Start</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Session Stop</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Total Amount</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Session Outcome</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Total P/L ($)</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Notes</th>
                                    <th className={`px-3 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                                {trades.map((trade) => (
                                    <tr key={trade.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <input type="date" value={editTradeData.date} onChange={(e) => setEditTradeData({ ...editTradeData, date: e.target.value })} className={`w-32 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} />
                                            ) : (
                                                trade.timestamp?.toDate().toLocaleDateString()
                                            )}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="text" value={editTradeData.asset} onChange={(e) => setEditTradeData({ ...editTradeData, asset: e.target.value })} className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.asset}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="number" value={editTradeData.numberOfTrades} onChange={(e) => setEditTradeData({ ...editTradeData, numberOfTrades: e.target.value })} className={`w-16 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.numberOfTrades}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="text" value={editTradeData.tradeDuration} onChange={(e) => setEditTradeData({ ...editTradeData, tradeDuration: e.target.value })} className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.tradeDuration}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? (
                                                <select value={editTradeData.direction} onChange={(e) => setEditTradeData({ ...editTradeData, direction: e.target.value })} className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`}>
                                                    <option value="Buy">Buy</option> <option value="Sell">Sell</option>
                                                </select>
                                            ) : trade.direction}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="time" value={editTradeData.tradeStartTime} onChange={(e) => setEditTradeData({ ...editTradeData, tradeStartTime: e.target.value })} className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.tradeStartTime}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="time" value={editTradeData.tradeStopTime} onChange={(e) => setEditTradeData({ ...editTradeData, tradeStopTime: e.target.value })} className={`w-24 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.tradeStopTime}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <input type="number" step="0.01" value={editTradeData.amount} onChange={(e) => setEditTradeData({ ...editTradeData, amount: e.target.value })} className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : `$${trade.amount.toFixed(2)}`}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold`}>
                                            {editingTradeId === trade.id ? (
                                                <select value={editTradeData.outcome} onChange={(e) => setEditTradeData({ ...editTradeData, outcome: e.target.value })} className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`}>
                                                    <option value="Win">Win</option> <option value="Loss">Loss</option> <option value="Draw">Draw</option>
                                                </select>
                                            ) : <span className={`${trade.outcome === 'Win' ? (isDarkMode ? 'text-green-400' : 'text-green-600') : trade.outcome === 'Loss' ? (isDarkMode ? 'text-red-400' : 'text-red-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>{trade.outcome}</span>}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold`}>
                                            {editingTradeId === trade.id ? <input type="number" step="0.01" value={editTradeData.profit} onChange={(e) => setEditTradeData({ ...editTradeData, profit: e.target.value })} className={`w-20 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : <span className={`${trade.profit >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>${trade.profit.toFixed(2)}</span>}
                                        </td>
                                        <td className={`px-3 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {editingTradeId === trade.id ? <textarea value={editTradeData.notes} onChange={(e) => setEditTradeData({ ...editTradeData, notes: e.target.value })} rows={1} className={`w-32 p-1 border ${isDarkMode ? 'border-gray-600 bg-gray-900 text-gray-300' : 'border-gray-300 bg-white text-gray-900'} rounded-md`} /> : trade.notes}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs flex space-x-1">
                                            {editingTradeId === trade.id ? (
                                                <>
                                                    <button onClick={() => saveEditingTrade(trade.id)} className={`text-green-500 hover:text-green-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`} title="Save"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></button>
                                                    <button onClick={cancelEditingTrade} className={`text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`} title="Cancel"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEditingTrade(trade)} className={`text-gray-500 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500`} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" /></svg></button>
                                                    <button onClick={() => handleDeleteTrade(trade.id)} className={`text-red-500 hover:text-red-700 transition-colors rounded-full p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500`} title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
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