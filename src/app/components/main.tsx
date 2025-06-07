'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import ShowModal from "./Modal/ShowModal";
import ShowCapitalManagementModal from "./Modal/ShowCapitalManagementModal";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from "../lib/firebaseClient";
import SectionPage from "./SectionPage";
import { endOfDay, endOfWeek, isSameWeek, isSameDay, formatDateForInput, formatYYYYMMDD, getDaysInMonth, startOfDay, startOfWeek } from "../utils/dateManipulation";
import ShowDailyProfitExpectationModal from "./Modal/ShowDailyProfitExpectationModal";
import ShowWeeklyProfitExpectationModal from "./Modal/ShowWeeklyProfitExpectationModal";
import ShowAddJournalModal from "./Modal/ShowAddJournalModal";
import { chat } from "../lib/groqConfig";
import { HumanMessage } from "@langchain/core/messages";

export default function Main() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const userId = user?.uid;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'defaultAppId';
    // const toggleTheme = () => {
    //     setTheme(theme === 'dark' ? 'light' : 'dark');
    // };
    const isDarkMode = theme === 'dark';

    type Journal = {
        id: string;
        name: string;
        lastAccessedAt?: Timestamp;
        [key: string]: unknown;
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

    // interface TradeWithId extends Trade {
    //     id: string;
    //     timestamp: Timestamp;
    //   }

    interface Transaction {
        id: string;
        type: 'deposit' | 'withdrawal';
        amount: number;
        note?: string;
        timestamp: { toDate: () => Date };
    }
    const [journals, setJournals] = useState<Journal[]>([]);
    const [currentJournalId, setCurrentJournalId] = useState<string | null>(null);
    const [currentJournalName, setCurrentJournalName] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars

    const [trades, setTrades] = useState<TradeWithId[]>([]);
    // Form state for adding new trade
    const [tradeDate, setTradeDate] = useState(formatDateForInput(new Date())); // New: Date for the trade session
    const [asset, setAsset] = useState('');
    const [direction, setDirection] = useState('Buy');
    // Removed entryPrice, expiryPrice, openTime, expirationTime states for new trade form
    const [numberOfTrades, setNumberOfTrades] = useState(''); // New
    const [tradeDuration, setTradeDuration] = useState(''); // New
    const [tradeStartTime, setTradeStartTime] = useState(''); // New: Time of starting trading for the day
    const [tradeStopTime, setTradeStopTime] = useState(''); // New: Time of stopping trading for the day
    const [outcome, setOutcome] = useState('Win');
    const [amount, setAmount] = useState(''); // This will now be total amount for N trades
    const [profit, setProfit] = useState(''); // This will now be total profit for N trades
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalConfirmAction, setModalConfirmAction] = useState<(() => void) | undefined>(undefined);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dailyStats, setDailyStats] = useState<{ [dateKey: string]: { totalTrades: number; totalProfitLoss: number; tradeCount: number } }>({});
    type WeeklySummary = { startDate: string; endDate: string; totalProfitLoss: string; totalTrades: number };
    const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
    const [monthlySummary, setMonthlySummary] = useState({ totalProfitLoss: 0, totalTrades: 0 });

    const [currentBalance, setCurrentBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
    const [editTransactionAmount, setEditTransactionAmount] = useState('');
    const [editTransactionNote, setEditTransactionNote] = useState('');

    const [llmLoading, setLlmLoading] = useState(false);
    const [llmInsights, setLlmInsights] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars

    const [showCapitalManagementModal, setShowCapitalManagementModal] = useState(false);
    const [showDailyProfitExpectationModal, setShowDailyProfitExpectationModal] = useState(false);
    const [showWeeklyProfitExpectationModal, setShowWeeklyProfitExpectationModal] = useState(false);

    const [currentPage, setCurrentPage] = useState('Dashboard');

    const [dailyProfitExpectation, setDailyProfitExpectation] = useState(0);
    const [newDailyProfitExpectation, setNewDailyProfitExpectation] = useState('');
    const [weeklyProfitExpectation, setWeeklyProfitExpectation] = useState(0);
    const [newWeeklyProfitExpectation, setNewWeeklyProfitExpectation] = useState('');

    const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
    const [editTradeData, setEditTradeData] = useState({
        date: '', // New: for editing the trade date (YYYY-MM-DD string)
        asset: '',
        direction: 'Buy',
        numberOfTrades: '', // New
        tradeDuration: '', // New
        tradeStartTime: '', // New
        tradeStopTime: '', // New
        outcome: 'Win',
        amount: '',
        profit: '',
        notes: ''
    });

    type Goal = {
        id: string;
        type: string;
        periodStart?: { toDate: () => Date };
        periodEnd?: { toDate: () => Date };
        goalAmount?: number;
        actualProfit?: number;
        achieved?: boolean;
        [key: string]: unknown;
    };

    const [goalHistory, setGoalHistory] = useState<Goal[]>([]);

    const [showAddJournalModal, setShowAddJournalModal] = useState(false);
    const [newJournalName, setNewJournalName] = useState('');
    const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
    const [editJournalName, setEditJournalName] = useState('');

    // Fetch journals and set current journal
    const handleCreateJournal = useCallback(async (name = newJournalName) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        const trimmedName = name.trim();
        if (!trimmedName) { showMessageBox("Journal name cannot be empty."); return; }

        try {
            const journalsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals`);
            const newJournalRef = await addDoc(journalsCollectionRef, {
                name: trimmedName,
                createdAt: serverTimestamp(),
                lastAccessedAt: serverTimestamp()
            });
            // Automatically select the new journal
            setCurrentJournalId(newJournalRef.id);
            setCurrentJournalName(trimmedName);
            // Initialize sub-documents for the new journal
            const journalPath = `artifacts/${appId}/users/${userId}/journals/${newJournalRef.id}`;
            await setDoc(doc(db, `${journalPath}/userProfile/balance`), { currentBalance: 0, lastUpdated: serverTimestamp() }, { merge: true });
            await setDoc(doc(db, `${journalPath}/userProfile/dailyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });
            await setDoc(doc(db, `${journalPath}/userProfile/weeklyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });

            setNewJournalName('');
            setShowAddJournalModal(false);
            showMessageBox(`Journal "${trimmedName}" created successfully!`);
        } catch (error) {
            console.error("Error creating journal:", error);
            showMessageBox("Failed to create journal. Please try again.");
        }
    }, [userId, appId, newJournalName]);

    useEffect(() => {
        if (db && userId) {
            const journalsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals`);
            const qJournals = query(journalsCollectionRef, orderBy('lastAccessedAt', 'desc'));

            const unsubscribeJournals = onSnapshot(qJournals, async (snapshot) => {
                const fetchedJournals = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || '',
                        ...data
                    };
                });
                setJournals(fetchedJournals);

                if (fetchedJournals.length > 0 && currentJournalId === null) {
                    const lastAccessedJournal = fetchedJournals[0];
                    setCurrentJournalId(lastAccessedJournal.id);
                    setCurrentJournalName(lastAccessedJournal.name);
                    await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/journals`, lastAccessedJournal.id), {
                        lastAccessedAt: serverTimestamp()
                    });
                } else if (fetchedJournals.length === 0 && currentJournalId === null) {
                    await handleCreateJournal('My First Journal');
                }
            }, (error) => {
                console.error("Error fetching journals:", error);
            });

            return () => unsubscribeJournals();
        }
    }, [userId, appId, currentJournalId, handleCreateJournal]);

    // Fetch all data for the current journal
    useEffect(() => {
        if (db && userId && currentJournalId) {
            setLoading(true);
            const journalPath = `artifacts/${appId}/users/${userId}/journals/${currentJournalId}`;
            let listenersCount = 0;
            const totalListeners = 6; // trades, balance, transactions, dailyGoal, weeklyGoal, goalHistory

            const checkAndSetLoaded = () => {
                listenersCount++;
                if (listenersCount >= totalListeners) { // Use >= just in case
                    setLoading(false);
                }
            };

            const tradesUnsubscribe = onSnapshot(query(collection(db, `${journalPath}/trades`), orderBy('timestamp', 'desc')), (snapshot) => {
                setTrades(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TradeWithId)));
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching trades:", error); checkAndSetLoaded(); });

            const balanceUnsubscribe = onSnapshot(doc(db, `${journalPath}/userProfile/balance`), (docSnap) => {
                if (docSnap.exists()) {
                    setCurrentBalance(docSnap.data().currentBalance || 0);
                } else {
                    setDoc(doc(db, `${journalPath}/userProfile/balance`), { currentBalance: 0, lastUpdated: serverTimestamp() }, { merge: true });
                    setCurrentBalance(0);
                }
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching balance:", error); checkAndSetLoaded(); });

            const transactionsUnsubscribe = onSnapshot(query(collection(db, `${journalPath}/transactions`), orderBy('timestamp', 'desc')), (snapshot) => {
                setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching transactions:", error); checkAndSetLoaded(); });

            const dailyUnsubscribe = onSnapshot(doc(db, `${journalPath}/userProfile/dailyProfitExpectation`), (docSnap) => {
                if (docSnap.exists()) {
                    setDailyProfitExpectation(docSnap.data().amount || 0);
                } else {
                    setDoc(doc(db, `${journalPath}/userProfile/dailyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });
                    setDailyProfitExpectation(0);
                }
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching daily profit expectation:", error); checkAndSetLoaded(); });

            const weeklyUnsubscribe = onSnapshot(doc(db, `${journalPath}/userProfile/weeklyProfitExpectation`), (docSnap) => {
                if (docSnap.exists()) {
                    setWeeklyProfitExpectation(docSnap.data().amount || 0);
                } else {
                    setDoc(doc(db, `${journalPath}/userProfile/weeklyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });
                    setWeeklyProfitExpectation(0);
                }
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching weekly profit expectation:", error); checkAndSetLoaded(); });

            const goalsUnsubscribe = onSnapshot(query(collection(db, `${journalPath}/goals`), orderBy('periodEnd', 'desc')), (snapshot) => {
                setGoalHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal)));
                checkAndSetLoaded();
            }, (error) => { console.error("Error fetching goal history:", error); checkAndSetLoaded(); });

            return () => {
                if (tradesUnsubscribe) tradesUnsubscribe();
                if (balanceUnsubscribe) balanceUnsubscribe();
                if (transactionsUnsubscribe) transactionsUnsubscribe();
                if (dailyUnsubscribe) dailyUnsubscribe();
                if (weeklyUnsubscribe) weeklyUnsubscribe();
                if (goalsUnsubscribe) goalsUnsubscribe();
            };
        } else if (!currentJournalId) {
            setLoading(false); // Not loading if no journal is selected
            setTrades([]);
            setTransactions([]);
            setGoalHistory([]);
            setCurrentBalance(0);
        }
    }, [appId, userId, currentJournalId]);

    // Goal Finalization Logic
    useEffect(() => {
        if (!db || !userId || !currentJournalId || trades.length === 0) return;

        const finalizeGoals = async () => {
            const now = new Date();
            const goalsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/goals`);

            // --- Daily Goal Finalization ---
            const dailyGoalsSnapshot = await getDocs(query(goalsCollectionRef, orderBy('periodEnd', 'desc')));
            const lastDailyGoalDoc = dailyGoalsSnapshot.docs.find(doc => doc.data().type === 'daily');
            const lastDailyPeriodEnd = lastDailyGoalDoc ? lastDailyGoalDoc.data().periodEnd?.toDate() : null;

            let checkDate = lastDailyPeriodEnd
                ? startOfDay(new Date(lastDailyPeriodEnd.getTime() + 24 * 60 * 60 * 1000))
                : startOfDay(trades.length > 0 && trades[trades.length - 1].timestamp?.toDate() ? trades[trades.length - 1].timestamp.toDate() : now);


            while (checkDate < startOfDay(now)) {
                const periodStart = startOfDay(checkDate);
                const periodEnd = endOfDay(checkDate);

                const existingGoal = goalHistory.some(
                    g => g.type === 'daily' && g.periodStart && isSameDay(g.periodStart.toDate(), periodStart)
                );

                if (!existingGoal) {
                    const dailyProfit = trades.reduce((sum, trade) => {
                        const tradeDate = trade.timestamp && typeof trade.timestamp.toDate === 'function'
                            ? trade.timestamp.toDate()
                            : (typeof trade.timestamp === 'string' || typeof trade.timestamp === 'number'
                                ? new Date(trade.timestamp)
                                : null);
                        if (tradeDate && isSameDay(tradeDate, periodStart)) {
                            return sum + trade.profit;
                        }
                        return sum;
                    }, 0);

                    const achieved = dailyProfit >= dailyProfitExpectation;
                    await addDoc(goalsCollectionRef, {
                        type: 'daily', goalAmount: dailyProfitExpectation, actualProfit: dailyProfit,
                        periodStart, periodEnd, achieved, timestamp: serverTimestamp()
                    });
                }
                checkDate = startOfDay(new Date(checkDate.getTime() + 24 * 60 * 60 * 1000));
            }

            // --- Weekly Goal Finalization ---
            const weeklyGoalsSnapshot = await getDocs(query(goalsCollectionRef, orderBy('periodEnd', 'desc')));
            const lastWeeklyGoalDoc = weeklyGoalsSnapshot.docs.find(doc => doc.data().type === 'weekly');
            const lastWeeklyPeriodEnd = lastWeeklyGoalDoc ? lastWeeklyGoalDoc.data().periodEnd?.toDate() : null;

            let checkWeekDate = lastWeeklyPeriodEnd
                ? startOfWeek(new Date(lastWeeklyPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000))
                : startOfWeek(trades.length > 0 && trades[trades.length - 1].timestamp?.toDate() ? trades[trades.length - 1].timestamp.toDate() : now);

            while (checkWeekDate < startOfWeek(now)) {
                const periodStart = startOfWeek(checkWeekDate);
                const periodEnd = endOfWeek(checkWeekDate);

                const existingGoal = goalHistory.some(
                    g => g.type === 'weekly' && g.periodStart && isSameWeek(g.periodStart.toDate(), periodStart)
                );

                if (!existingGoal) {
                    const weeklyProfit = trades.reduce((sum, trade) => {
                        const tradeDate = trade.timestamp?.toDate
                            ? trade.timestamp.toDate()
                            : (typeof trade.timestamp === 'string' || typeof trade.timestamp === 'number'
                                ? new Date(trade.timestamp)
                                : null);
                        if (tradeDate && tradeDate >= periodStart && tradeDate <= periodEnd) {
                            return sum + trade.profit;
                        }
                        return sum;
                    }, 0);

                    const achieved = weeklyProfit >= weeklyProfitExpectation;
                    await addDoc(goalsCollectionRef, {
                        type: 'weekly', goalAmount: weeklyProfitExpectation, actualProfit: weeklyProfit,
                        periodStart, periodEnd, achieved, timestamp: serverTimestamp()
                    });
                }
                checkWeekDate = startOfWeek(new Date(checkWeekDate.getTime() + 7 * 24 * 60 * 60 * 1000));
            }
        };
        finalizeGoals();
    }, [userId, appId, currentJournalId, trades, dailyProfitExpectation, weeklyProfitExpectation, goalHistory]);

    const showMessageBox = (message: string) => {
        setModalMessage(message);
        setModalConfirmAction(undefined);
        setShowModal(true);
    };

    const showConfirmationModal = (message: string, onConfirm: () => void) => {
        setModalMessage(message);
        setModalConfirmAction(() => onConfirm); // Ensure it's a function
        setShowModal(true);
    };


    interface TradeData {
        asset: string;
        direction: string;
        numberOfTrades: number;
        tradeDuration: string;
        tradeStartTime: string;
        tradeStopTime: string;
        outcome: string;
        amount: number;
        profit: number;
        notes: string;
        timestamp: Timestamp; // Firestore Timestamp
    }

    const handleAddTrade = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        if (!tradeDate || !asset || !numberOfTrades || !tradeDuration || !tradeStartTime || !tradeStopTime || !amount || !profit) {
            showMessageBox("Please fill in all required fields (Date, Asset, Number of Trades, Duration, Session Times, Amount, Profit/Loss).");
            return;
        }

        const tradeProfitVal: number = parseFloat(profit);
        const tradeAmountVal: number = parseFloat(amount);
        const numTradesVal: number = parseInt(numberOfTrades);

        if (isNaN(tradeProfitVal) || isNaN(tradeAmountVal) || isNaN(numTradesVal) || numTradesVal <= 0) {
            showMessageBox("Amount, Profit/Loss, and Number of Trades must be valid positive numbers.");
            return;
        }

        try {
            // Construct timestamp from tradeDate and tradeStartTime
            const combinedDateTimeString: string = `${tradeDate}T${tradeStartTime}`;
            const entryTimestamp: Timestamp = Timestamp.fromDate(new Date(combinedDateTimeString));

            const tradeData: TradeData = {
                asset,
                direction,
                numberOfTrades: numTradesVal,
                tradeDuration,
                tradeStartTime, // Session start time
                tradeStopTime,  // Session stop time
                outcome,
                amount: tradeAmountVal, // Total amount for these N trades
                profit: tradeProfitVal, // Total profit for these N trades
                notes,
                timestamp: entryTimestamp // Firestore Timestamp based on tradeDate and tradeStartTime
            };
            const tradesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`);
            await addDoc(tradesCollectionRef, tradeData);

            const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
            await setDoc(balanceDocRef, { currentBalance: currentBalance + tradeProfitVal, lastUpdated: serverTimestamp() }, { merge: true });

            // Reset form fields
            setTradeDate(formatDateForInput(new Date())); setAsset(''); setDirection('Buy');
            setNumberOfTrades(''); setTradeDuration('');
            setTradeStartTime(''); setTradeStopTime('');
            setOutcome('Win'); setAmount(''); setProfit(''); setNotes('');
            showMessageBox("Trade session added successfully and balance updated!");
        } catch (error) {
            console.error("Error adding trade session:", error);
            const errorMsg = (error instanceof Error) ? error.message : String(error);
            showMessageBox("Failed to add trade session. Please try again. Error: " + errorMsg);
        }
    };

    const handleDeleteTrade = (tradeId: string) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        showConfirmationModal("Are you sure you want to delete this trade entry? This will also reverse its impact on your balance.", async () => {
            try {
                const tradeToDelete = trades.find(trade => trade.id === tradeId);
                if (!tradeToDelete) { showMessageBox("Trade not found."); return; }

                const tradeDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`, tradeId);
                await deleteDoc(tradeDocRef);

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance - tradeToDelete.profit, lastUpdated: serverTimestamp() }, { merge: true });
                showMessageBox("Trade entry deleted successfully and balance updated!");
            } catch (error) {
                console.error("Error deleting trade:", error);
                showMessageBox("Failed to delete trade. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    interface TradeWithId extends TradeData {
        id: string;
        [key: string]: unknown;
    }

    const startEditingTrade = (trade: Trade) => {
        setEditingTradeId(trade.id);
        setEditTradeData({
            date: trade.timestamp ? formatDateForInput(trade.timestamp.toDate()) : '',
            asset: trade.asset || '',
            direction: trade.direction || 'Buy',
            numberOfTrades: trade.numberOfTrades !== undefined && trade.numberOfTrades !== null ? trade.numberOfTrades.toString() : '',
            tradeDuration: trade.tradeDuration || '',
            tradeStartTime: trade.tradeStartTime || '',
            tradeStopTime: trade.tradeStopTime || '',
            outcome: trade.outcome || 'Win',
            amount: trade.amount !== undefined && trade.amount !== null ? String(trade.amount) : '',
            profit: trade.profit !== undefined && trade.profit !== null ? String(trade.profit) : '',
            notes: trade.notes || ''
        });
    };

    const cancelEditingTrade = () => {
        setEditingTradeId(null);
        // Reset editTradeData to initial empty/default values
        setEditTradeData({
            date: '', asset: '', direction: 'Buy', numberOfTrades: '', tradeDuration: '',
            tradeStartTime: '', tradeStopTime: '', outcome: 'Win', amount: '', profit: '', notes: ''
        });
    };

    const saveEditingTrade = async (tradeId: string) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        const originalTrade = trades.find(trade => trade.id === tradeId);
        if (!originalTrade) { showMessageBox("Original trade not found."); return; }

        const updatedProfit = parseFloat(editTradeData.profit);
        const updatedAmount = parseFloat(editTradeData.amount);
        const updatedNumberOfTrades = parseInt(editTradeData.numberOfTrades);

        if (isNaN(updatedProfit) || isNaN(updatedAmount) || isNaN(updatedNumberOfTrades) || updatedNumberOfTrades <= 0) {
            showMessageBox("Amount, Profit/Loss, and Number of Trades must be valid positive numbers.");
            return;
        }
        if (!editTradeData.date || !editTradeData.tradeStartTime) {
            showMessageBox("Date and Trade Start Time are required for editing.");
            return;
        }

        showConfirmationModal("Are you sure you want to save changes to this trade entry? This will adjust your balance.", async () => {
            try {
                const profitDifference = updatedProfit - originalTrade.profit;

                // Construct new timestamp from edited date and start time
                const combinedDateTimeString = `${editTradeData.date}T${editTradeData.tradeStartTime}`;
                const newTimestamp = Timestamp.fromDate(new Date(combinedDateTimeString));

                const tradeDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`, tradeId);
                await updateDoc(tradeDocRef, {
                    asset: editTradeData.asset,
                    direction: editTradeData.direction,
                    numberOfTrades: updatedNumberOfTrades,
                    tradeDuration: editTradeData.tradeDuration,
                    tradeStartTime: editTradeData.tradeStartTime,
                    tradeStopTime: editTradeData.tradeStopTime,
                    outcome: editTradeData.outcome,
                    amount: updatedAmount,
                    profit: updatedProfit,
                    notes: editTradeData.notes,
                    timestamp: newTimestamp // Update the timestamp
                });

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + profitDifference, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Trade entry updated successfully and balance adjusted!");
                cancelEditingTrade();
            } catch (error) {
                console.error("Error saving trade:", error);
                const errorMsg = (error instanceof Error) ? error.message : String(error);
                showMessageBox("Failed to save trade. Please try again. Error: " + errorMsg);
            } finally { setShowModal(false); }
        });
    };


    const handleDeposit = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const depositVal = parseFloat(depositAmount);
        if (isNaN(depositVal) || depositVal <= 0) { showMessageBox("Please enter a valid positive deposit amount."); return; }

        showConfirmationModal(`Are you sure you want to deposit $${depositVal.toFixed(2)}?`, async () => {
            try {
                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + depositVal, lastUpdated: serverTimestamp() }, { merge: true });

                const transactionsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`);
                await addDoc(transactionsCollectionRef, { type: 'deposit', amount: depositVal, timestamp: serverTimestamp(), note: 'Manual deposit' });

                setDepositAmount('');
                showMessageBox("Deposit successful!");
            } catch (error) {
                console.error("Error depositing funds:", error);
                showMessageBox("Failed to deposit funds. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const handleWithdraw = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const withdrawVal = parseFloat(withdrawAmount);
        if (isNaN(withdrawVal) || withdrawVal <= 0) { showMessageBox("Please enter a valid positive withdrawal amount."); return; }
        if (withdrawVal > currentBalance) { showMessageBox("Withdrawal amount cannot exceed current balance."); return; }

        showConfirmationModal(`Are you sure you want to withdraw $${withdrawVal.toFixed(2)}?`, async () => {
            try {
                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance - withdrawVal, lastUpdated: serverTimestamp() }, { merge: true });

                const transactionsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`);
                await addDoc(transactionsCollectionRef, { type: 'withdrawal', amount: withdrawVal, timestamp: serverTimestamp(), note: 'Manual withdrawal' });

                setWithdrawAmount('');
                showMessageBox("Withdrawal successful!");
            } catch (error) {
                console.error("Error withdrawing funds:", error);
                showMessageBox("Failed to withdraw funds. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const handleResetJournal = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        showConfirmationModal("Are you sure you want to reset the CURRENT journal? This will delete all trades, transactions, and reset its balance to zero. This action cannot be undone.", async () => {
            try {
                const batch = writeBatch(db);
                const journalPath = `artifacts/${appId}/users/${userId}/journals/${currentJournalId}`;
                const subcollectionsToDelete = ['trades', 'transactions', 'goals', 'userProfile'];

                for (const subColName of subcollectionsToDelete) {
                    const subCollectionRef = collection(db, `${journalPath}/${subColName}`);
                    const snapshot = await getDocs(subCollectionRef);
                    snapshot.docs.forEach(d => batch.delete(d.ref));
                }
                // Re-initialize balance and goals after deleting them.
                batch.set(doc(db, `${journalPath}/userProfile/balance`), { currentBalance: 0, lastUpdated: serverTimestamp() }, { merge: true });
                batch.set(doc(db, `${journalPath}/userProfile/dailyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });
                batch.set(doc(db, `${journalPath}/userProfile/weeklyProfitExpectation`), { amount: 0, lastUpdated: serverTimestamp() }, { merge: true });

                await batch.commit();
                showMessageBox("Current journal reset successfully!");
            } catch (error) {
                console.error("Error resetting journal:", error);
                showMessageBox("Failed to reset journal. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const startEditingTransaction = (transaction: Transaction) => {
        setEditingTransactionId(transaction.id);
        setEditTransactionAmount(transaction.amount.toString());
        setEditTransactionNote(transaction.note || '');
    };

    const cancelEditingTransaction = () => {
        setEditingTransactionId(null);
        setEditTransactionAmount('');
        setEditTransactionNote('');
    };

    const saveEditingTransaction = async (transactionId: string) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        const newAmount = parseFloat(editTransactionAmount);
        if (isNaN(newAmount) || newAmount <= 0) {
            showMessageBox("Please enter a valid positive amount for the transaction.");
            return;
        }

        showConfirmationModal("Are you sure you want to save changes to this transaction? This will adjust your balance.", async () => {
            try {
                const originalTransaction = transactions.find(t => t.id === transactionId);
                if (!originalTransaction) {
                    showMessageBox("Original transaction not found.");
                    return;
                }

                const oldAmount = originalTransaction.amount;
                const type = originalTransaction.type;
                let balanceChange = 0;

                if (type === 'deposit') {
                    balanceChange = newAmount - oldAmount;
                } else if (type === 'withdrawal') {
                    balanceChange = oldAmount - newAmount;
                }

                const transactionDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`, transactionId);
                await updateDoc(transactionDocRef, {
                    amount: newAmount,
                    note: editTransactionNote,
                    timestamp: serverTimestamp() // Keep original timestamp or update? Let's update.
                });

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + balanceChange, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Transaction updated and balance adjusted!");
                cancelEditingTransaction();
            } catch (error) {
                console.error("Error saving transaction:", error);
                showMessageBox("Failed to save transaction. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const deleteTransaction = (transactionId: string) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        showConfirmationModal("Are you sure you want to delete this transaction? This will reverse its impact on your balance.", async () => {
            try {
                const transactionToDelete = transactions.find(t => t.id === transactionId);
                if (!transactionToDelete) {
                    showMessageBox("Transaction not found.");
                    return;
                }

                const transactionDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`, transactionId);
                await deleteDoc(transactionDocRef);

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                const amountToReverse = transactionToDelete.type === 'deposit' ? -transactionToDelete.amount : transactionToDelete.amount;
                await setDoc(balanceDocRef, { currentBalance: currentBalance + amountToReverse, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Transaction deleted and balance adjusted!");
            } catch (error) {
                console.error("Error deleting transaction:", error);
                showMessageBox("Failed to delete transaction. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const handleSaveDailyProfitExpectation = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const expectation = parseFloat(newDailyProfitExpectation);
        if (isNaN(expectation)) {
            showMessageBox("Please enter a valid number for daily profit expectation.");
            return;
        }

        try {
            const dailyProfitExpectationDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/dailyProfitExpectation`);
            await setDoc(dailyProfitExpectationDocRef, { amount: expectation, lastUpdated: serverTimestamp() }, { merge: true });
            // setDailyProfitExpectation(expectation); // This will be updated by onSnapshot
            setNewDailyProfitExpectation('');
            showMessageBox("Daily profit expectation saved successfully!");
            setShowDailyProfitExpectationModal(false);
        } catch (error) {
            console.error("Error saving daily profit expectation:", error);
            showMessageBox("Failed to save daily profit expectation. Please try again.");
        }
    };

    const handleSaveWeeklyProfitExpectation = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const expectation = parseFloat(newWeeklyProfitExpectation);
        if (isNaN(expectation)) {
            showMessageBox("Please enter a valid number for weekly profit expectation.");
            return;
        }

        try {
            const weeklyProfitExpectationDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/weeklyProfitExpectation`);
            await setDoc(weeklyProfitExpectationDocRef, { amount: expectation, lastUpdated: serverTimestamp() }, { merge: true });
            // setWeeklyProfitExpectation(expectation); // This will be updated by onSnapshot
            setNewWeeklyProfitExpectation('');
            showMessageBox("Weekly profit expectation saved successfully!");
            setShowWeeklyProfitExpectationModal(false);
        } catch (error) {
            console.error("Error saving weekly profit expectation:", error);
            showMessageBox("Failed to save weekly profit expectation. Please try again.");
        }
    };

    const calculateStats = useCallback(() => {
        let totalProfitLoss = 0;
        let winCount = 0;
        let lossCount = 0;
        let totalWinProfit = 0;
        let totalLossAmount = 0;
        let totalTrades = 0; // Sum of numberOfTrades from each entry

        trades.forEach(trade => {
            totalProfitLoss += trade.profit;
            totalTrades += (trade.numberOfTrades || 1);

            if (trade.outcome === 'Win') {
                winCount += (trade.numberOfTrades || 1);
                totalWinProfit += trade.profit;
            } else if (trade.outcome === 'Loss') {
                lossCount += (trade.numberOfTrades || 1);
                totalLossAmount += Math.abs(trade.profit);
            }
        });

        const overallTotalTrades = winCount + lossCount;
        const winRate = overallTotalTrades > 0 ? (winCount / overallTotalTrades) * 100 : 0;
        const averageProfitPerWin = winCount > 0 ? totalWinProfit / winCount : 0;
        const averageLossPerLoss = lossCount > 0 ? -totalLossAmount / lossCount : 0; // negative for loss
        const profitFactor = totalLossAmount > 0 ? (totalWinProfit / totalLossAmount) : (totalWinProfit > 0 ? Infinity : 0);

        // Additional stats for LLM prompt
        const totalTradeEntries = trades.length;
        const totalIndividualTrades = totalTrades;
        // Average profit/loss per winning/losing session (not per trade)
        const winningSessions = trades.filter(trade => trade.outcome === 'Win');
        const losingSessions = trades.filter(trade => trade.outcome === 'Loss');
        const averageProfitPerWinningSession = winningSessions.length > 0
            ? winningSessions.reduce((sum, t) => sum + t.profit, 0) / winningSessions.length
            : 0;
        const averageLossPerLosingSession = losingSessions.length > 0
            ? losingSessions.reduce((sum, t) => sum + t.profit, 0) / losingSessions.length
            : 0;

        return {
            totalProfitLoss,
            winRate,
            totalTrades,
            averageProfitPerWin,
            averageLossPerLoss,
            profitFactor: profitFactor === Infinity ? Number.POSITIVE_INFINITY : profitFactor,
            totalTradeEntries,
            totalIndividualTrades,
            averageProfitPerWinningSession,
            averageLossPerLosingSession
        };
    }, [trades]);


    const stats = calculateStats();

    const currentDayProfit = useMemo(() => {
        const todayFormatted = formatYYYYMMDD(new Date());
        return trades.reduce((sum, trade) => {
            const tradeDateFormatted = trade.timestamp ? formatYYYYMMDD(trade.timestamp.toDate()) : '';
            if (tradeDateFormatted === todayFormatted) {
                return sum + trade.profit;
            }
            return sum;
        }, 0);
    }, [trades]);

    const currentWeekProfit = useMemo(() => {
        const now = new Date();
        const startOfCurrentWeek = startOfWeek(now);
        const endOfCurrentWeek = endOfWeek(now);

        return trades.reduce((sum, trade) => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : null;
            if (tradeDate && tradeDate >= startOfCurrentWeek && tradeDate <= endOfCurrentWeek) {
                return sum + trade.profit;
            }
            return sum;
        }, 0);
    }, [trades]);


    useEffect(() => {
        type DailyStat = { totalTrades: number; totalProfitLoss: number; tradeCount: number };
        const newDailyStats: { [dateKey: string]: DailyStat } = {};
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999); // Ensure it covers the whole last day

        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : null;
            if (tradeDate && tradeDate >= monthStart && tradeDate <= monthEnd) {
                const dateKey = formatYYYYMMDD(tradeDate);
                if (!newDailyStats[dateKey]) { newDailyStats[dateKey] = { totalTrades: 0, totalProfitLoss: 0, tradeCount: 0 }; }
                newDailyStats[dateKey].totalTrades += (trade.numberOfTrades || 1);
                newDailyStats[dateKey].totalProfitLoss += trade.profit;
                newDailyStats[dateKey].tradeCount += 1; // Number of entries for the day
            }
        });
        setDailyStats(newDailyStats);

        let currentMonthProfitLoss = 0;
        let currentMonthTrades = 0; // Total individual trades for the month
        const newWeeklySummaries: WeeklySummary[] = [];
        let currentWeekProfitLoss = 0;
        let currentWeekTrades = 0; // Total individual trades for the week
        let weekStartDate: Date | null = null;

        const allDaysInMonth = getDaysInMonth(currentMonth).filter(day => day !== null);

        allDaysInMonth.forEach((day, index) => {
            const dateKey = formatYYYYMMDD(day);
            const dayStatsData = newDailyStats[dateKey] || { totalTrades: 0, totalProfitLoss: 0 };

            currentMonthProfitLoss += dayStatsData.totalProfitLoss;
            currentMonthTrades += dayStatsData.totalTrades;

            if (weekStartDate === null) { weekStartDate = day; }
            currentWeekProfitLoss += dayStatsData.totalProfitLoss;
            currentWeekTrades += dayStatsData.totalTrades;

            if (day.getDay() === 6 || index === allDaysInMonth.length - 1) { // Saturday or last day of month
                newWeeklySummaries.push({
                    startDate: formatYYYYMMDD(weekStartDate),
                    endDate: formatYYYYMMDD(day),
                    totalProfitLoss: currentWeekProfitLoss.toFixed(2),
                    totalTrades: currentWeekTrades
                });
                currentWeekProfitLoss = 0;
                currentWeekTrades = 0;
                weekStartDate = null; // Reset for next week
            }
        });

        setWeeklySummaries(newWeeklySummaries);
        setMonthlySummary({ totalProfitLoss: Number(currentMonthProfitLoss.toFixed(2)), totalTrades: currentMonthTrades });

    }, [trades, currentMonth]);

    const handlePrevMonth = () => { setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)); };
    const handleNextMonth = () => { setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)); };

    // const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // const daysInMonth = getDaysInMonth(currentMonth);

    const cumulativeProfitLossChartData = useMemo(() => {
        const dailyProfits: { [dateKey: string]: number } = {};
        // Sort trades by timestamp to ensure correct cumulative calculation
        const sortedTrades = [...trades].sort((a, b) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));

        sortedTrades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : null;
            if (!tradeDate) return;
            const dateKey = formatYYYYMMDD(tradeDate);
            if (!dailyProfits[dateKey]) { dailyProfits[dateKey] = 0; }
            dailyProfits[dateKey] += trade.profit;
        });

        const sortedDates = Object.keys(dailyProfits).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        let cumulativeProfit = 0;
        const data: { date: string; 'Cumulative Profit': number }[] = [];

        sortedDates.forEach(date => {
            cumulativeProfit += dailyProfits[date];
            data.push({ date: date, 'Cumulative Profit': parseFloat(cumulativeProfit.toFixed(2)) });
        });
        return data;
    }, [trades]);


    const dailyProfitLossBarChartData = useMemo<{ date: string; profit: number }[]>(() => {
        const dailyData: { [date: string]: { date: string; profit: number } } = {};
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : null;
            if (!tradeDate) return;
            const dateKey = formatYYYYMMDD(tradeDate);
            if (!dailyData[dateKey]) { dailyData[dateKey] = { date: dateKey, profit: 0 }; }
            dailyData[dateKey].profit += trade.profit;
        });
        return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [trades]);

    const winRateByAssetData = useMemo(() => {
        type AssetStats = {
            wins: number;
            losses: number;
            draws: number;
            total: number;
            totalProfit: number;
        };
        const assetStats: { [assetName: string]: AssetStats } = {};
        trades.forEach(trade => {
            const assetName = trade.asset || 'Unknown';
            if (!assetStats[assetName]) { assetStats[assetName] = { wins: 0, losses: 0, draws: 0, total: 0, totalProfit: 0 }; }
            const numTradesInEntry = trade.numberOfTrades || 1;
            assetStats[assetName].total += numTradesInEntry;
            assetStats[assetName].totalProfit += trade.profit;

            if (trade.outcome === 'Win') { assetStats[assetName].wins += numTradesInEntry; }
            else if (trade.outcome === 'Loss') { assetStats[assetName].losses += numTradesInEntry; }
            else { assetStats[assetName].draws += numTradesInEntry; }
        });

        return Object.keys(assetStats).map(assetName => ({
            name: assetName,
            wins: assetStats[assetName].wins,
            losses: assetStats[assetName].losses,
            draws: assetStats[assetName].draws,
            total: assetStats[assetName].total,
            totalProfit: assetStats[assetName].totalProfit,
            winRate: assetStats[assetName].total > 0 ? (assetStats[assetName].wins / assetStats[assetName].total * 100).toFixed(2) : 0
        }));
    }, [trades]);

    const winRateByDirectionData = useMemo(() => {
        const directionStats = { 'Buy': { wins: 0, losses: 0, draws: 0, total: 0, totalProfit: 0 }, 'Sell': { wins: 0, losses: 0, draws: 0, total: 0, totalProfit: 0 } };
        trades.forEach(trade => {
            const directionName = trade.direction as 'Buy' | 'Sell';
            if (directionName === 'Buy' || directionName === 'Sell') {
                const numTradesInEntry = trade.numberOfTrades || 1;
                directionStats[directionName].total += numTradesInEntry;
                directionStats[directionName].totalProfit += trade.profit;
                if (trade.outcome === 'Win') { directionStats[directionName].wins += numTradesInEntry; }
                else if (trade.outcome === 'Loss') { directionStats[directionName].losses += numTradesInEntry; }
                else { directionStats[directionName].draws += numTradesInEntry; }
            }
        });

        return (Object.keys(directionStats) as Array<'Buy' | 'Sell'>).map((directionName) => ({
            name: directionName,
            wins: directionStats[directionName].wins,
            losses: directionStats[directionName].losses,
            draws: directionStats[directionName].draws,
            total: directionStats[directionName].total,
            totalProfit: directionStats[directionName].totalProfit,
            winRate: directionStats[directionName].total > 0 ? (directionStats[directionName].wins / directionStats[directionName].total * 100).toFixed(2) : 0
        })).filter(d => d.total > 0);
    }, [trades]);


    const profitLossDistributionData = useMemo(() => {
        // This chart might be less relevant now as 'profit' is per session, not per individual trade.
        // For now, let's base it on the session profit.
        const bins = { '< -$100': 0, '-$100 to -$50': 0, '-$50 to $0': 0, '$0 to $50': 0, '$50 to $100': 0, '> $100': 0 };
        trades.forEach(trade => {
            const profitVal = trade.profit; // Session profit
            if (profitVal < -100) bins['< -$100']++;
            else if (profitVal < -50) bins['-$100 to -$50']++;
            else if (profitVal < 0) bins['-$50 to $0']++;
            else if (profitVal < 50) bins['$0 to $50']++;
            else if (profitVal < 100) bins['$50 to $100']++;
            else bins['> $100']++;
        });
        return Object.entries(bins).map(([range, count]) => ({ range, count })).filter(b => b.count > 0);
    }, [trades]);

    const tradeCountByDayOfWeekData = useMemo(() => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts = Array(7).fill(0).map((_, i) => ({ name: weekdays[i], count: 0 }));
        
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate();
            if (tradeDate) {
                const dayIndex = tradeDate.getDay(); // 0 for Sun, 1 for Mon, ...
                dayCounts[dayIndex].count += (trade.numberOfTrades || 1); // Sum of individual trades
            }
        });
        return dayCounts.filter(d => d.count > 0);
    }, [trades]);


    const tradeCountByHourOfDayData = useMemo(() => {
        const hourCounts = Array.from({ length: 24 }, (_, i) => ({ name: `${String(i).padStart(2, '0')}:00`, count: 0 }));
        trades.forEach(trade => {
            // tradeStartTime is a string like "HH:MM". We need the hour part.
            if (trade.tradeStartTime) {
                const hour = parseInt(trade.tradeStartTime.split(':')[0]);
                if (!isNaN(hour) && hour >= 0 && hour < 24) {
                    hourCounts[hour].count += (trade.numberOfTrades || 1); // Sum of individual trades
                }
            }
        });
        return hourCounts.filter(h => h.count > 0);
    }, [trades]);

    const averageProfitLossData = useMemo(() => {
        // This represents average profit/loss PER SESSION
        let totalWinSessionProfit = 0; let winSessionCount = 0;
        let totalLossSessionProfit = 0; let lossSessionCount = 0;
        trades.forEach(trade => {
            if (trade.outcome === 'Win') { totalWinSessionProfit += trade.profit; winSessionCount++; }
            else if (trade.outcome === 'Loss') { totalLossSessionProfit += trade.profit; lossSessionCount++; }
        });
        const avgWinSession = winSessionCount > 0 ? (totalWinSessionProfit / winSessionCount) : 0;
        const avgLossSession = lossSessionCount > 0 ? (totalLossSessionProfit / lossSessionCount) : 0; // Loss is negative
        return [
            { name: 'Average Win Session', value: parseFloat(avgWinSession.toFixed(2)) },
            { name: 'Average Loss Session', value: parseFloat(avgLossSession.toFixed(2)) }
        ].filter(d => d.value !== 0 || (d.name === 'Average Loss Session' && lossSessionCount > 0) || (d.name === 'Average Win Session' && winSessionCount > 0));
    }, [trades]);

    // Function to get insights from LLM
    const handleGetTradingInsights = async () => {
        if (!userId || !currentJournalId) {
            showMessageBox("Please select a journal to get insights.");
            return;
        }
        setLlmLoading(true);
        setLlmInsights('');

        try {
            const overallStats = calculateStats(); // Recalculate with new structure if needed
            const assetPerformance = winRateByAssetData;
            const directionPerformance = winRateByDirectionData;

            const recentTradeNotes = trades.slice(0, 5).map((trade: TradeWithId) => ({
                date: trade.timestamp ? formatYYYYMMDD(trade.timestamp.toDate()) : 'N/A',
                asset: trade.asset,
                numberOfTrades: trade.numberOfTrades,
                outcome: trade.outcome,
                totalProfit: trade.profit,
                notes: trade.notes
            }));

            const prompt = `Analyze the following binary options trading data. Each entry might represent a session with multiple trades. Provide actionable insights, patterns, and suggestions.
  
            Overall Trading Statistics:
            - Total Trade Entries (Sessions): ${overallStats.totalTradeEntries}
            - Total Individual Trades: ${overallStats.totalIndividualTrades}
            - Overall Win Rate (based on individual trades): ${overallStats.winRate}%
            - Net Profit/Loss: $${overallStats.totalProfitLoss}
            - Average Profit per Winning Session: $${overallStats.averageProfitPerWinningSession}
            - Average Loss per Losing Session: $${overallStats.averageLossPerLosingSession}
            - Profit Factor: ${overallStats.profitFactor}
            
            Performance by Asset (shows total individual trades and win rate for that asset):
            ${assetPerformance.map(a => `- ${a.name}: ${a.winRate}% Win Rate, ${a.total} individual trades, Total P/L: $${a.totalProfit.toFixed(2)}`).join('\n')}
            
            Performance by Direction (Buy/Sell - shows total individual trades and win rate for that direction):
            ${directionPerformance.map(d => `- ${d.name}: ${d.winRate}% Win Rate, ${d.total} individual trades, Total P/L: $${d.totalProfit.toFixed(2)}`).join('\n')}
            
            Recent Trade Session Notes (last 5 sessions, if available):
            ${recentTradeNotes.length > 0 ? recentTradeNotes.map(trade => `  - Date: ${trade.date}, Asset: ${trade.asset}, Trades in Session: ${trade.numberOfTrades}, Outcome: ${trade.outcome}, Session Profit: $${trade.totalProfit.toFixed(2)}, Notes: "${trade.notes}"`).join('\n') : "No recent trade notes available."}
            
            Based on this data, provide:
            1.  **Key Strengths and Weaknesses:** What are the most apparent positive and negative patterns in these trading sessions?
            2.  **Actionable Strategy Adjustments:** What specific changes could be made to improve performance (e.g., focus on certain assets, times, durations)?
            3.  **Risk Management Observations:** Any insights on risk based on session outcomes or amounts?
            4.  **Emotional/Psychological Insights (from notes):** If notes suggest any emotional patterns, mention them.
            5.  **Overall Recommendation:** A concise summary of advice for future trading sessions.
            `;

            // Use LangChain to call the Groq API
            const response = await chat.invoke([new HumanMessage(prompt)]);

            if (response.content) {
                const text = typeof response.content === 'string'
                    ? response.content
                    : Array.isArray(response.content)
                        ? response.content.map(part => typeof part === 'string' ? part : JSON.stringify(part)).join('\n')
                        : String(response.content);
                setLlmInsights(text);
                showMessageBox("Trading Insights:\n\n" + text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*/g, '-')); // Basic markdown cleanup for modal
            } else {
                console.error("Unexpected response structure:", response);
                showMessageBox("Failed to get insights. Unexpected API response.");
            }
        } catch (error) {
            console.error("Error calling Groq API:", error);
            const errorMsg = (error instanceof Error) ? error.message : String(error);
            showMessageBox("Failed to get insights. Error: " + errorMsg);
        } finally {
            setLlmLoading(false);
        }
  };


    const exportToCsv = (data: Record<string, unknown>[], filename: string) => {
        if (!data || data.length === 0) {
            showMessageBox(`No data to export for ${filename}.`);
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                let value = row[header];
                if (typeof value === 'object' && value !== null) {
                    if (
                        typeof value === 'object' &&
                        value !== null &&
                        'toDate' in value &&
                        typeof (value as { toDate?: unknown }).toDate === 'function'
                    ) { // Firestore Timestamp
                        value = (value as { toDate: () => Date }).toDate().toLocaleString();
                    } else { // Other objects
                        value = JSON.stringify(value);
                    }
                }
                value = String(value).replace(/"/g, '""'); // Escape double quotes
                if (String(value).includes(',') || String(value).includes('\n')) { // Enclose if contains comma or newline
                    value = `"${value}"`;
                }
                return value;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            showMessageBox("CSV export not fully supported in this browser.");
        }
    };

    const exportTradeHistory = () => {
        const formattedTrades = trades.map(trade => ({
            Date: trade.timestamp?.toDate ? trade.timestamp.toDate().toLocaleDateString() : '',
            Asset: trade.asset,
            Direction: trade.direction,
            NumberOfTrades: trade.numberOfTrades,
            TradeDuration: trade.tradeDuration,
            SessionStartTime: trade.tradeStartTime,
            SessionStopTime: trade.tradeStopTime,
            AmountInvestedTotal: trade.amount,
            Outcome: trade.outcome,
            ProfitLossTotal: trade.profit,
            Notes: trade.notes
        }));
        exportToCsv(formattedTrades, 'trade_history.csv');
    };

    const exportTransactions = () => {
        const formattedTransactions = transactions.map(transaction => ({
            Date: transaction.timestamp?.toDate ? transaction.timestamp.toDate().toLocaleDateString() : '',
            Type: transaction.type,
            Amount: transaction.amount,
            Notes: transaction.note
        }));
        exportToCsv(formattedTransactions, 'transactions.csv');
    };

    const exportOverallStats = () => {
        const overallStatsData = [{
            'Total Trade Entries': stats.totalTradeEntries,
            'Total Individual Trades': stats.totalIndividualTrades,
            'Win Rate (%)': stats.winRate,
            'Net Profit/Loss ($)': stats.totalProfitLoss,
            'Average Profit per Winning Session ($)': stats.averageProfitPerWinningSession,
            'Average Loss per Losing Session ($)': stats.averageLossPerLosingSession,
            'Profit Factor': stats.profitFactor
        }];
        exportToCsv(overallStatsData, 'overall_trading_statistics.csv');
    };

    const exportWinRateByAsset = () => exportToCsv(winRateByAssetData, 'win_rate_by_asset.csv');
    const exportWinRateByDirection = () => exportToCsv(winRateByDirectionData, 'win_rate_by_direction.csv');
    const exportProfitLossDistribution = () => exportToCsv(profitLossDistributionData, 'profit_loss_distribution.csv');
    const exportTradeCountByDayOfWeek = () => exportToCsv(tradeCountByDayOfWeekData, 'trade_count_by_day_of_week.csv');
    const exportTradeCountByHourOfDay = () => exportToCsv(tradeCountByHourOfDayData, 'trade_count_by_hour_of_day.csv');
    const exportAverageProfitLoss = () => exportToCsv(averageProfitLossData, 'average_profit_loss_per_session.csv');


    const exportDailyCalendarData = () => {
        const formattedDailyStats = Object.keys(dailyStats).map(date => ({
            Date: date,
            TotalIndividualTrades: dailyStats[date].totalTrades,
            TotalProfitLoss: dailyStats[date].totalProfitLoss,
            TradeEntries: dailyStats[date].tradeCount
        })).sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
        exportToCsv(formattedDailyStats, 'calendar_daily_performance.csv');
    };

    const exportWeeklyCalendarData = () => {
        exportToCsv(weeklySummaries.map(w => ({
            WeekStartDate: w.startDate,
            WeekEndDate: w.endDate,
            TotalIndividualTrades: w.totalTrades,
            TotalProfitLoss: w.totalProfitLoss
        })), 'calendar_weekly_summaries.csv');
    };

    const exportMonthlyCalendarData = () => {
        const formattedMonthlySummary = [{
            Month: currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
            TotalIndividualTrades: monthlySummary.totalTrades,
            TotalProfitLoss: monthlySummary.totalProfitLoss
        }];
        exportToCsv(formattedMonthlySummary, 'calendar_monthly_summary.csv');
    };

    const exportGoalHistory = () => {
        const formattedGoals = goalHistory.map(goal => ({
            Type: goal.type.charAt(0).toUpperCase() + goal.type.slice(1),
            Period: `${goal.periodStart?.toDate().toLocaleDateString()} - ${goal.periodEnd?.toDate().toLocaleDateString()}`,
            GoalAmount: goal.goalAmount,
            ActualProfit: goal.actualProfit,
            Achieved: goal.achieved ? 'Yes' : 'No'
        }));
        exportToCsv(formattedGoals, 'goal_history.csv');
    };


    // Journal Management Functions
    const handleSelectJournal = async (journalId: string, journalName: string) => {
        if (!db || !userId || journalId === currentJournalId) return;
        setLoading(true); // Set loading true when switching journals
        setCurrentJournalId(journalId);
        setCurrentJournalName(journalName);
        await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId), {
            lastAccessedAt: serverTimestamp()
        });
        // Data fetching useEffect will trigger due to currentJournalId change and set loading to false
        showMessageBox(`Switched to journal: "${journalName}"`);
        setCurrentPage('Dashboard');
    };

    const startEditingJournal = (journal: Journal) => {
        setEditingJournalId(journal.id);
        setEditJournalName(journal.name);
    };

    const cancelEditingJournal = () => {
        setEditingJournalId(null);
        setEditJournalName('');
    };

    const saveEditingJournal = async (journalId: string) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        if (!editJournalName.trim()) {
            showMessageBox("Journal name cannot be empty.");
            return;
        }

        showConfirmationModal(`Are you sure you want to rename this journal to "${editJournalName.trim()}"?`, async () => {
            try {
                const journalDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId);
                await updateDoc(journalDocRef, { name: editJournalName.trim() });
                if (currentJournalId === journalId) {
                    setCurrentJournalName(editJournalName.trim());
                }
                showMessageBox("Journal renamed successfully!");
                cancelEditingJournal();
            } catch (error) {
                console.error("Error renaming journal:", error);
                showMessageBox("Failed to rename journal. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const handleDeleteJournal = (journalId: string, journalName: string) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        if (journals.length <= 1) { // Prevent deleting the last journal
            showMessageBox("You cannot delete your only journal. Create another one first if you wish to delete this one.");
            return;
        }

        showConfirmationModal(`Are you sure you want to delete the journal "${journalName}" and ALL its associated data (trades, transactions, goals, balance)? This action cannot be undone.`, async () => {
            try {
                const batch = writeBatch(db);
                const journalDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId);

                const subcollectionsData = ['trades', 'transactions', 'goals', 'userProfile'];
                for (const subColName of subcollectionsData) {
                    const subColRef = collection(db, journalDocRef.path, subColName);
                    const snapshot = await getDocs(subColRef);
                    snapshot.docs.forEach(d => batch.delete(d.ref));
                }
                batch.delete(journalDocRef);
                await batch.commit();

                // After deletion, select another journal
                if (currentJournalId === journalId) {
                    const remainingJournals = journals.filter(j => j.id !== journalId);
                    if (remainingJournals.length > 0) {
                        // Sort remaining journals by lastAccessedAt (desc) to pick the most recent
                        remainingJournals.sort((a, b) => {
                            const aMillis = a.lastAccessedAt && typeof a.lastAccessedAt.toMillis === 'function'
                                ? a.lastAccessedAt.toMillis()
                                : 0;
                            const bMillis = b.lastAccessedAt && typeof b.lastAccessedAt.toMillis === 'function'
                                ? b.lastAccessedAt.toMillis()
                                : 0;
                            return bMillis - aMillis;
                        });
                        const newCurrent = remainingJournals[0];
                        await handleSelectJournal(newCurrent.id, newCurrent.name);
                    } else { // This case should not be hit due to the check above
                        setCurrentJournalId(null);
                        setCurrentJournalName('');
                    }
                }
                showMessageBox(`Journal "${journalName}" and all its data deleted successfully.`);
            } catch (error) {
                console.error("Error deleting journal:", error);
                const errorMsg = (error instanceof Error) ? error.message : String(error);
                showMessageBox("Failed to delete journal. Please try again. Error: " + errorMsg);
            } finally { setShowModal(false); }
        });
    };


    // Calculate 20% of current balance for risk amount
    const amountToRisk = useMemo(() => {
        return (currentBalance * 0.20).toFixed(2);
    }, [currentBalance]);

    const dailyProgress = dailyProfitExpectation > 0 ? (currentDayProfit / dailyProfitExpectation) * 100 : 0;
    const weeklyProgress = weeklyProfitExpectation > 0 ? (currentWeekProfit / weeklyProfitExpectation) * 100 : 0;


    // If data is still loading, show a loading spinner
    if (!userId) { // Also check if userId is available before showing main app
        return (
            <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} font-inter`}>
                <div className="text-lg font-semibold">Initializing authentication...</div>
            </div>
        );
    }
    if (loading && currentJournalId) { // Show loading only if a journal is selected and data is being fetched
        return (
            <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} font-inter`}>
                <div className="text-lg font-semibold">Loading journal data...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} p-4 font-inter`}>
            {/* Custom Modal */}
            {showModal && (
                <ShowModal
                    isDarkMode={isDarkMode}
                    modalMessage={modalMessage}
                    modalConfirmAction={modalConfirmAction}
                    setShowModal={setShowModal}
                />
            )}
            {/* Capital Management Modal */}
            {showCapitalManagementModal && (
                <ShowCapitalManagementModal
                    isDarkMode={isDarkMode}
                    setShowCapitalManagementModal={setShowCapitalManagementModal}
                    depositAmount={depositAmount}
                    setDepositAmount={setDepositAmount}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    handleDeposit={handleDeposit}
                    handleWithdraw={handleWithdraw}
                    handleResetJournal={handleResetJournal}
                />
            )}
            {/* Daily Profit Expectation Modal */}
            {showDailyProfitExpectationModal && (
                <ShowDailyProfitExpectationModal
                    isDarkMode={isDarkMode}
                    setShowDailyProfitExpectationModal={setShowDailyProfitExpectationModal}
                    newDailyProfitExpectation={newDailyProfitExpectation}
                    setNewDailyProfitExpectation={value => setNewDailyProfitExpectation(String(value))}
                    handleSaveDailyProfitExpectation={handleSaveDailyProfitExpectation}
                    dailyProfitExpectation={dailyProfitExpectation}
                />
            )}
            {/* Weekly Profit Expectation Modal */}
            {showWeeklyProfitExpectationModal && (
                <ShowWeeklyProfitExpectationModal
                    isDarkMode={isDarkMode}
                    setShowWeeklyProfitExpectationModal={setShowWeeklyProfitExpectationModal}
                    newWeeklyProfitExpectation={newWeeklyProfitExpectation}
                    setNewWeeklyProfitExpectation={setNewWeeklyProfitExpectation}
                    handleSaveWeeklyProfitExpectation={handleSaveWeeklyProfitExpectation}
                    weeklyProfitExpectation={weeklyProfitExpectation}
                />
            )}
            {/* Add New Journal Modal */}
            {showAddJournalModal && (
                <ShowAddJournalModal
                    isDarkMode={isDarkMode}
                    setShowAddJournalModal={setShowAddJournalModal}
                    newJournalName={newJournalName}
                    handleCreateJournal={handleCreateJournal}
                    setNewJournalName={setNewJournalName}
                />
            )} 

            {/* Main displayed plage */}
            <SectionPage
                isDarkMode={isDarkMode}
                currentJournalId={currentJournalId}
                journals={journals}
                handleSelectJournal={handleSelectJournal} 
                setShowAddJournalModal={setShowAddJournalModal}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                editingJournalId={editingJournalId}
                editJournalName={editJournalName}
                setEditJournalName={setEditJournalName}
                handleDeleteJournal= {handleDeleteJournal}
                startEditingJournal={startEditingJournal}
                cancelEditingJournal={cancelEditingJournal}
                saveEditingJournal={saveEditingJournal}
                exportGoalHistory={exportGoalHistory}
                goalHistory={goalHistory.map(g => ({
                    ...g,
                    goalAmount: g.goalAmount ?? 0,
                    actualProfit: g.actualProfit ?? 0,
                    achieved: g.achieved ?? false
                }))}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                currentMonth={currentMonth}
                dailyStats={dailyStats}
                weeklySummaries={weeklySummaries.map(w => ({
                    ...w,
                    totalProfitLoss: Number(w.totalProfitLoss)
                }))}
                monthlySummary={monthlySummary}
                exportDailyCalendarData={exportDailyCalendarData}
                exportWeeklyCalendarData={exportWeeklyCalendarData}
                exportMonthlyCalendarData={exportMonthlyCalendarData}
                exportTransactions={exportTransactions}
                transactions={transactions
                    .filter(t => t.timestamp && typeof t.timestamp.toDate === 'function')
                    .map(t => ({
                        ...t,
                        type: t.type === "deposit" ? "deposit" : "withdrawal",
                        timestamp: t.timestamp as { toDate: () => Date } // Type assertion ensures compatibility
                    })) as Transaction[]
                }
                deleteTransaction={deleteTransaction}
                startEditingTransaction={startEditingTransaction}
                cancelEditingTransaction={cancelEditingTransaction}
                saveEditingTransaction={saveEditingTransaction}
                editingTransactionId={editingTransactionId}
                editTransactionAmount={editTransactionAmount}
                setEditTransactionAmount={setEditTransactionAmount}
                editTransactionNote={editTransactionNote}
                setEditTransactionNote={setEditTransactionNote}
                cumulativeProfitLossChartData={cumulativeProfitLossChartData}
                dailyProfitLossBarChartData={dailyProfitLossBarChartData}
                dailyProfitExpectation={dailyProfitExpectation}
                winRateByAssetData={winRateByAssetData}
                winRateByDirectionData={winRateByDirectionData}
                profitLossDistributionData={profitLossDistributionData}
                tradeCountByDayOfWeekData={tradeCountByDayOfWeekData}
                tradeCountByHourOfDayData={tradeCountByHourOfDayData}
                exportOverallStats={exportOverallStats}
                exportWinRateByAsset={exportWinRateByAsset}
                exportWinRateByDirection={exportWinRateByDirection}
                exportProfitLossDistribution={exportProfitLossDistribution}
                exportTradeCountByDayOfWeek={exportTradeCountByDayOfWeek}
                exportTradeCountByHourOfDay={exportTradeCountByHourOfDay}
                averageProfitLossData={averageProfitLossData}
                exportAverageProfitLoss={exportAverageProfitLoss}
                handleAddTrade={handleAddTrade}
                trades={trades}
                exportTradeHistory={exportTradeHistory}
                asset={asset}
                setAsset={setAsset}
                direction={direction}
                setDirection={setDirection}
                amount={amount}
                setAmount={setAmount}
                outcome={outcome}
                setOutcome={setOutcome}
                profit={profit}
                setProfit={setProfit}
                notes={notes}
                setNotes={setNotes}
                editingTradeId={editingTradeId}
                editTradeData={editTradeData}
                setEditTradeData={(data) =>
                    setEditTradeData({
                        ...data,
                        date: String(data.date),
                        asset: String(data.asset),
                        direction: String(data.direction),
                        numberOfTrades: String(data.numberOfTrades),
                        tradeDuration: String(data.tradeDuration),
                        tradeStartTime: String(data.tradeStartTime),
                        tradeStopTime: String(data.tradeStopTime),
                        outcome: String(data.outcome),
                        amount: String(data.amount),
                        profit: String(data.profit),
                        notes: String(data.notes),
                    })
                }
                cancelEditingTrade={cancelEditingTrade}
                handleDeleteTrade={handleDeleteTrade}
                startEditingTrade={startEditingTrade}
                saveEditingTrade={saveEditingTrade}
                currentBalance={currentBalance}
                stats={stats}
                weeklyProfitExpectation={weeklyProfitExpectation}
                currentDayProfit={currentDayProfit}
                currentWeekProfit={currentWeekProfit}
                dailyProgress={dailyProgress}
                weeklyProgress={weeklyProgress}
                amountToRisk={amountToRisk}
                setShowDailyProfitExpectationModal={setShowDailyProfitExpectationModal}
                setShowWeeklyProfitExpectationModal={setShowWeeklyProfitExpectationModal}
                setShowCapitalManagementModal={setShowCapitalManagementModal}
                handleGetTradingInsights={handleGetTradingInsights}
                llmLoading={llmLoading}
                numberOfTrades={numberOfTrades}
                setNumberOfTrades={setNumberOfTrades}
                tradeDuration={tradeDuration}
                setTradeDuration={setTradeDuration}
                tradeStopTime={tradeStopTime}
                setTradeStopTime={setTradeStopTime}
                tradeStartTime={tradeStartTime}
                setTradeStartTime={setTradeStartTime}
                tradeDate={tradeDate}
                setTradeDate={setTradeDate}
             />
        </div>
    )
}
